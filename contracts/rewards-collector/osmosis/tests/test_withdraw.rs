use cosmwasm_std::{coin, testing::mock_env, to_binary, CosmosMsg, SubMsg, Uint128, WasmMsg};
use mars_red_bank_types::rewards_collector::{
    credit_manager::{self, Action, ActionAmount, ActionCoin},
    ExecuteMsg,
};
use mars_rewards_collector_base::ContractError;
use mars_rewards_collector_osmosis::entry::execute;
use mars_testing::mock_info;

mod helpers;

#[test]
fn withdrawing_from_red_bank() {
    let mut deps = helpers::setup_test();

    // anyone can execute a withdrawal
    let res = execute(
        deps.as_mut(),
        mock_env(),
        mock_info("jake"),
        ExecuteMsg::WithdrawFromRedBank {
            denom: "uatom".to_string(),
            amount: Some(Uint128::new(42069)),
        },
    )
    .unwrap();

    assert_eq!(res.messages.len(), 1);
    assert_eq!(
        res.messages[0],
        SubMsg::new(CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: "red_bank".to_string(),
            msg: to_binary(&mars_red_bank_types::red_bank::ExecuteMsg::Withdraw {
                denom: "uatom".to_string(),
                amount: Some(Uint128::new(42069)),
                recipient: None,
                account_id: None
            })
            .unwrap(),
            funds: vec![]
        }))
    )
}

#[test]
fn withdrawing_from_cm_if_action_not_allowed() {
    let mut deps = helpers::setup_test();

    // anyone can execute a withdrawal
    let error_res = execute(
        deps.as_mut(),
        mock_env(),
        mock_info("jake"),
        ExecuteMsg::WithdrawFromCreditManager {
            account_id: "random_id".to_string(),
            actions: vec![
                Action::Withdraw(coin(100u128, "uatom")),
                Action::Unknown {},
                Action::WithdrawLiquidity {
                    lp_token: ActionCoin {
                        denom: "gamm/pool/1".to_string(),
                        amount: ActionAmount::AccountBalance,
                    },
                    minimum_receive: vec![],
                },
            ],
        },
    )
    .unwrap_err();
    assert_eq!(error_res, ContractError::InvalidActionsForCreditManager {});
}

#[test]
fn withdrawing_from_cm_successfully() {
    let mut deps = helpers::setup_test();

    let account_id = "random_id".to_string();
    let actions = vec![
        Action::Withdraw(coin(100u128, "uusdc")),
        Action::WithdrawLiquidity {
            lp_token: ActionCoin {
                denom: "gamm/pool/1".to_string(),
                amount: ActionAmount::AccountBalance,
            },
            minimum_receive: vec![],
        },
        Action::Withdraw(coin(120u128, "uatom")),
        Action::Withdraw(coin(140u128, "uosmo")),
    ];

    // anyone can execute a withdrawal
    let res = execute(
        deps.as_mut(),
        mock_env(),
        mock_info("jake"),
        ExecuteMsg::WithdrawFromCreditManager {
            account_id: account_id.clone(),
            actions: actions.clone(),
        },
    )
    .unwrap();

    assert_eq!(res.messages.len(), 1);
    assert_eq!(
        res.messages[0],
        SubMsg::new(CosmosMsg::Wasm(WasmMsg::Execute {
            contract_addr: "credit_manager".to_string(),
            msg: to_binary(&credit_manager::ExecuteMsg::UpdateCreditAccount {
                account_id,
                actions
            })
            .unwrap(),
            funds: vec![]
        }))
    )
}