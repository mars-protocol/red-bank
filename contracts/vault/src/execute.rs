use cosmwasm_std::{
    attr, ensure_eq, to_json_binary, Coin, CosmosMsg, Deps, DepsMut, Env, Event, MessageInfo,
    Response, StdError, StdResult, Uint128, WasmMsg,
};
use mars_types::credit_manager::{self, Action, ActionCoin, Positions, QueryMsg};

use crate::{
    contract::NtrnBaseVault,
    error::ContractError,
    state::{CREDIT_MANAGER, FOUND_MANAGER_ACC_ID},
};

pub fn bind_credit_manager_account(
    deps: DepsMut,
    info: &MessageInfo,
    account_id: String,
) -> Result<Response, ContractError> {
    let credit_manager = CREDIT_MANAGER.load(deps.storage)?;
    ensure_eq!(info.sender, credit_manager, ContractError::NotCreditManager {});

    FOUND_MANAGER_ACC_ID.save(deps.storage, &account_id)?;

    let event = Event::new("vault/bind_credit_manager_account")
        .add_attributes(vec![attr("account_id", account_id)]);
    Ok(Response::new().add_event(event))
}

pub fn deposit(
    deps: DepsMut,
    env: Env,
    info: &MessageInfo,
    amount: Uint128,
    recipient: Option<String>,
) -> Result<Response, ContractError> {
    // Unwrap recipient or use caller's address
    let vault_token_recipient =
        recipient.map_or(Ok(info.sender.clone()), |x| deps.api.addr_validate(&x))?;

    let base_vault = NtrnBaseVault::default();

    // Check that only the expected amount of base token was sent
    if info.funds.len() > 1 {
        return Err(ContractError::UnexpectedFunds {
            expected: vec![Coin {
                denom: base_vault.base_token.load(deps.storage)?.to_string(),
                amount,
            }],
            actual: info.funds.clone(),
        });
    }

    // Load state
    let vault_token = base_vault.vault_token.load(deps.storage)?;
    let total_staked_amount = base_vault.total_staked_base_tokens.load(deps.storage)?;
    let vault_token_supply = vault_token.query_total_supply(deps.as_ref())?;

    // Calculate how many base tokens the given amount of vault tokens represents
    let vault_tokens =
        base_vault.calculate_vault_tokens(amount, total_staked_amount, vault_token_supply)?;

    // Update total staked amount
    base_vault
        .total_staked_base_tokens
        .save(deps.storage, &total_staked_amount.checked_add(amount)?)?;

    let event = Event::new("vault/execute_staking").add_attributes(vec![
        attr("action", "execute_mint_vault_token"),
        attr("recipient", vault_token_recipient.to_string()),
        attr("mint_amount", vault_tokens),
    ]);

    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let cm_acc_id = FOUND_MANAGER_ACC_ID.load(deps.storage)?;

    let coin_deposited = Coin {
        denom: base_vault.base_token.load(deps.storage)?.to_string(),
        amount,
    };

    let deposit_to_cm = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cm_addr.to_string(),
        msg: to_json_binary(&credit_manager::ExecuteMsg::UpdateCreditAccount {
            account_id: Some(cm_acc_id.clone()),
            account_kind: None,
            actions: vec![Action::Deposit(coin_deposited.clone())],
        })?,
        funds: vec![coin_deposited],
    });

    // Return Response with message to mint vault tokens
    Ok(vault_token
        .mint(deps, &env, &vault_token_recipient, vault_tokens)?
        .add_message(deposit_to_cm)
        .add_event(event))
}

pub fn redeem(
    mut deps: DepsMut,
    env: Env,
    info: &MessageInfo,
    vault_token_amount: Uint128,
    recipient: Option<String>,
) -> Result<Response, ContractError> {
    // Unwrap recipient or use caller's address
    let recipient = recipient.map_or(Ok(info.sender.clone()), |x| deps.api.addr_validate(&x))?;

    let base_vault = NtrnBaseVault::default();
    let base_token = base_vault.base_token.load(deps.storage)?;

    let (tokens_to_withdraw, burn_res) =
        base_vault.burn_vault_tokens_for_base_tokens(deps.branch(), &env, vault_token_amount)?;

    // TODO: Is this needed?
    // Send unstaked base tokes to recipient
    // let send_res = base_vault.send_base_tokens(deps, &recipient, tokens_to_withdraw)?;

    let event = Event::new("vault/execute_redeem").add_attributes(vec![
        attr("action", "execute_callback_redeem"),
        attr("recipient", recipient.clone()),
        attr("vault_token_amount", vault_token_amount),
        attr("lp_tokens_to_unstake", tokens_to_withdraw),
    ]);

    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let cm_acc_id = FOUND_MANAGER_ACC_ID.load(deps.storage)?;

    let mut actions = vec![];

    let amount_to_unlend =
        get_amount_to_unlend(deps.as_ref(), base_token.clone(), tokens_to_withdraw)?;
    if !amount_to_unlend.is_zero() {
        actions.push(Action::Reclaim(ActionCoin {
            denom: base_token.clone(),
            amount: credit_manager::ActionAmount::Exact(amount_to_unlend),
        }));
    }
    // TODO: Withdraw to wallet
    // actions.push(Action::WithdrawToWallet {
    //     coin: ActionCoin {
    //         denom: base_token,
    //         amount: credit_manager::ActionAmount::Exact(tokens_to_withdraw),
    //     },
    //     recipient: recipient.to_string(),
    // });

    let withdraw_from_cm = CosmosMsg::Wasm(WasmMsg::Execute {
        contract_addr: cm_addr.to_string(),
        msg: to_json_binary(&credit_manager::ExecuteMsg::UpdateCreditAccount {
            account_id: Some(cm_acc_id.clone()),
            account_kind: None,
            actions,
        })?,
        funds: vec![],
    });

    Ok(burn_res.add_message(withdraw_from_cm).add_event(event))
}

pub fn merge_responses(responses: Vec<Response>) -> Response {
    let mut merged = Response::default();
    for response in responses {
        merged = merged
            .add_attributes(response.attributes)
            .add_events(response.events)
            .add_submessages(response.messages);
        // merge data
        if let Some(data) = response.data {
            if merged.data.is_none() {
                merged.data = Some(data);
            } else {
                panic!("Cannot merge multiple responses with data");
            }
        }
    }
    merged
}

pub fn get_amount_to_unlend(
    deps: Deps,
    base_token: String,
    withraw_amount: Uint128,
) -> Result<Uint128, ContractError> {
    let cm_addr = CREDIT_MANAGER.load(deps.storage)?;
    let cm_acc_id = FOUND_MANAGER_ACC_ID.load(deps.storage)?;

    let postions: StdResult<Positions> = deps.querier.query_wasm_smart(
        cm_addr,
        &QueryMsg::Positions {
            account_id: cm_acc_id,
        },
    );
    let postions = postions?;
    let base_token_deposited = postions
        .deposits
        .iter()
        .filter(|d| d.denom == base_token)
        .map(|d| d.amount)
        .sum::<Uint128>();
    let base_token_lend =
        postions.lends.iter().filter(|d| d.denom == base_token).map(|d| d.amount).sum::<Uint128>();

    if withraw_amount <= base_token_deposited {
        return Ok(Uint128::zero());
    }

    let left_amount_to_unlend = withraw_amount - base_token_deposited;
    if left_amount_to_unlend <= base_token_lend {
        Ok(left_amount_to_unlend)
    } else {
        Err(StdError::generic_err("Not enough base token to withdraw").into())
    }
}
