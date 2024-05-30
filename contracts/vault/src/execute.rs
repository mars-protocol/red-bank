use cosmwasm_std::{
    attr, ensure_eq, to_json_binary, Coin, CosmosMsg, Deps, DepsMut, Env, Event, MessageInfo,
    Response, StdError, Uint128, WasmMsg,
};
use mars_types::credit_manager::{self, Action, ActionAmount, ActionCoin, Positions, QueryMsg};

use crate::{
    contract::Vault,
    error::ContractError,
    state::{CREDIT_MANAGER, VAULT_ACC_ID},
};

pub fn bind_credit_manager_account(
    deps: DepsMut,
    info: &MessageInfo,
    account_id: String,
) -> Result<Response, ContractError> {
    let credit_manager = CREDIT_MANAGER.load(deps.storage)?;
    ensure_eq!(info.sender, credit_manager, ContractError::NotCreditManager {});

    // only one binding allowed
    let vault_acc_id = VAULT_ACC_ID.may_load(deps.storage)?;
    if vault_acc_id.is_some() {
        return Err(ContractError::VaultAccountExists {});
    }

    VAULT_ACC_ID.save(deps.storage, &account_id)?;

    let event = Event::new("vault/bind_credit_manager_account")
        .add_attributes(vec![attr("account_id", account_id)]);
    Ok(Response::new().add_event(event))
}

pub fn deposit(
    deps: DepsMut,
    env: Env,
    info: &MessageInfo,
    recipient: Option<String>,
) -> Result<Response, ContractError> {
    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let Some(vault_acc_id) = VAULT_ACC_ID.may_load(deps.storage)? else {
        // bind credit manager account first
        return Err(ContractError::VaultAccountNotFound {});
    };

    // unwrap recipient or use caller's address
    let vault_token_recipient =
        recipient.map_or(Ok(info.sender.clone()), |r| deps.api.addr_validate(&r))?;

    // load state
    let vault = Vault::default();
    let base_token = vault.base_token.load(deps.storage)?.to_string();
    let vault_token = vault.vault_token.load(deps.storage)?;
    let total_staked_amount = vault.total_staked_base_tokens.load(deps.storage)?;

    // check that only the expected base token was sent
    let amount = cw_utils::must_pay(info, &base_token)?;

    // calculate vault tokens
    let vault_token_supply = vault_token.query_total_supply(deps.as_ref())?;
    let vault_tokens =
        vault.calculate_vault_tokens(amount, total_staked_amount, vault_token_supply)?;

    // update total staked amount
    vault.total_staked_base_tokens.save(deps.storage, &total_staked_amount.checked_add(amount)?)?;

    let coin_deposited = Coin {
        denom: base_token,
        amount,
    };

    let deposit_to_cm = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cm_addr.to_string(),
        msg: to_json_binary(&credit_manager::ExecuteMsg::UpdateCreditAccount {
            account_id: Some(vault_acc_id.clone()),
            account_kind: None,
            actions: vec![Action::Deposit(coin_deposited.clone())],
        })?,
        funds: vec![coin_deposited],
    });

    let event = Event::new("vault/deposit").add_attributes(vec![
        attr("action", "mint_vault_tokens"),
        attr("recipient", vault_token_recipient.to_string()),
        attr("mint_amount", vault_tokens),
    ]);

    Ok(vault_token
        .mint(deps, &env, &vault_token_recipient, vault_tokens)?
        .add_message(deposit_to_cm)
        .add_event(event))
}

pub fn redeem(
    mut deps: DepsMut,
    env: Env,
    info: &MessageInfo,
    recipient: Option<String>,
) -> Result<Response, ContractError> {
    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let Some(vault_acc_id) = VAULT_ACC_ID.may_load(deps.storage)? else {
        // bind credit manager account first
        return Err(ContractError::VaultAccountNotFound {});
    };

    // unwrap recipient or use caller's address
    let recipient = recipient.map_or(Ok(info.sender.clone()), |x| deps.api.addr_validate(&x))?;

    // load state
    let vault = Vault::default();
    let base_token = vault.base_token.load(deps.storage)?;
    let vault_token = vault.vault_token.load(deps.storage)?;

    // check that only the expected vault token was sent
    let vault_token_amount = cw_utils::must_pay(info, &vault_token.to_string())?;

    let (tokens_to_withdraw, burn_res) =
        vault.burn_vault_tokens_for_base_tokens(deps.branch(), &env, vault_token_amount)?;

    let mut actions = vec![];

    let amount_to_unlend =
        get_amount_to_unlend(deps.as_ref(), base_token.clone(), tokens_to_withdraw)?;
    if !amount_to_unlend.is_zero() {
        actions.push(Action::Reclaim(ActionCoin {
            denom: base_token.clone(),
            amount: credit_manager::ActionAmount::Exact(amount_to_unlend),
        }));
    }

    actions.push(Action::WithdrawToWallet {
        coin: ActionCoin {
            denom: base_token,
            amount: ActionAmount::Exact(tokens_to_withdraw),
        },
        recipient: recipient.to_string(),
    });

    let withdraw_from_cm = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cm_addr.to_string(),
        msg: to_json_binary(&credit_manager::ExecuteMsg::UpdateCreditAccount {
            account_id: Some(vault_acc_id.clone()),
            account_kind: None,
            actions,
        })?,
        funds: vec![],
    });

    let event = Event::new("vault/redeem").add_attributes(vec![
        attr("action", "burn_vault_tokens"),
        attr("recipient", recipient.clone()),
        attr("vault_token_amount", vault_token_amount),
        attr("lp_tokens_to_withdraw", tokens_to_withdraw),
    ]);

    Ok(burn_res.add_message(withdraw_from_cm).add_event(event))
}

fn get_amount_to_unlend(
    deps: Deps,
    base_token: String,
    withraw_amount: Uint128,
) -> Result<Uint128, ContractError> {
    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let cm_acc_id = VAULT_ACC_ID.load(deps.storage)?;

    let positions: Positions = deps.querier.query_wasm_smart(
        cm_addr,
        &QueryMsg::Positions {
            account_id: cm_acc_id,
        },
    )?;
    let base_token_deposited = positions
        .deposits
        .iter()
        .filter(|d| d.denom == base_token)
        .map(|d| d.amount)
        .sum::<Uint128>();

    if withraw_amount <= base_token_deposited {
        return Ok(Uint128::zero());
    }

    let base_token_lend =
        positions.lends.iter().filter(|d| d.denom == base_token).map(|d| d.amount).sum::<Uint128>();

    let left_amount_to_unlend = withraw_amount - base_token_deposited;
    if left_amount_to_unlend <= base_token_lend {
        Ok(left_amount_to_unlend)
    } else {
        Err(StdError::generic_err("Not enough base token to withdraw").into())
    }
}