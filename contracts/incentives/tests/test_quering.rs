use cosmwasm_std::{Decimal, Timestamp, Uint128};
use mars_incentives::state::{EMISSIONS, INCENTIVE_STATES};
use mars_red_bank_types::incentives::{
    EmissionResponse, IncentiveState, IncentiveStateResponse, QueryMsg,
};
use mars_testing::{mock_env, MockEnvParams};
use test_case::test_case;

use crate::helpers::th_setup;

mod helpers;

#[test]
fn query_incentive_state() {
    let mut deps = th_setup();

    // incentives
    let uosmo_incentive = IncentiveState {
        index: Decimal::one(),
        last_updated: 150,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uosmo", "umars"), &uosmo_incentive).unwrap();
    let uatom_incentive = IncentiveState {
        index: Decimal::one(),
        last_updated: 1000,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uatom", "umars"), &uatom_incentive).unwrap();
    let uusdc_incentive = IncentiveState {
        index: Decimal::from_ratio(120u128, 50u128),
        last_updated: 120000,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uusdc", "umars"), &uusdc_incentive).unwrap();

    let res: IncentiveStateResponse = helpers::th_query(
        deps.as_ref(),
        QueryMsg::IncentiveState {
            collateral_denom: "uatom".to_string(),
            incentive_denom: "umars".to_string(),
        },
    );
    assert_eq!(
        res,
        IncentiveStateResponse::from("uatom".to_string(), "umars".to_string(), uatom_incentive)
    );
}

#[test]
fn query_incentive_states() {
    let mut deps = th_setup();

    // incentives
    let uosmo_incentive = IncentiveState {
        index: Decimal::one(),
        last_updated: 150,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uosmo", "umars"), &uosmo_incentive).unwrap();
    let uatom_incentive = IncentiveState {
        index: Decimal::one(),
        last_updated: 1000,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uatom", "umars"), &uatom_incentive).unwrap();
    let uusdc_incentive = IncentiveState {
        index: Decimal::from_ratio(120u128, 50u128),
        last_updated: 120000,
    };
    INCENTIVE_STATES.save(deps.as_mut().storage, ("uusdc", "umars"), &uusdc_incentive).unwrap();

    // NOTE: responses are ordered alphabetically by denom
    let res: Vec<IncentiveStateResponse> = helpers::th_query(
        deps.as_ref(),
        QueryMsg::IncentiveStates {
            start_after_collateral_denom: None,
            start_after_incentive_denom: None,
            limit: None,
        },
    );
    assert_eq!(
        res,
        vec![
            IncentiveStateResponse::from("uatom".to_string(), "umars".to_string(), uatom_incentive),
            IncentiveStateResponse::from(
                "uosmo".to_string(),
                "umars".to_string(),
                uosmo_incentive.clone()
            ),
            IncentiveStateResponse::from("uusdc".to_string(), "umars".to_string(), uusdc_incentive),
        ]
    );

    // NOTE: responses are ordered alphabetically by denom
    let res: Vec<IncentiveStateResponse> = helpers::th_query(
        deps.as_ref(),
        QueryMsg::IncentiveStates {
            start_after_collateral_denom: Some("uatom".to_string()),
            start_after_incentive_denom: None,
            limit: Some(1),
        },
    );
    assert_eq!(
        res,
        vec![IncentiveStateResponse::from(
            "uosmo".to_string(),
            "umars".to_string(),
            uosmo_incentive
        )]
    );
}

#[test]
fn query_emission() {
    let mut deps = th_setup();

    EMISSIONS.save(deps.as_mut().storage, ("uosmo", "umars", 604800), &Uint128::new(100)).unwrap();
    EMISSIONS
        .save(deps.as_mut().storage, ("uosmo", "umars", 604800 * 2), &Uint128::new(50))
        .unwrap();

    // Query before emission start
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 0,
        },
    );
    assert_eq!(res, Uint128::zero());

    // Query at timestamp of first emission start
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800,
        },
    );
    assert_eq!(res, Uint128::new(100));

    // Query at timestamp of second emission start
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800 * 2,
        },
    );
    assert_eq!(res, Uint128::new(50));

    // Query one second before second emission start
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800 * 2 - 1,
        },
    );
    assert_eq!(res, Uint128::new(100));

    // Query at timestamp some time into second emission start
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800 * 2 + 100,
        },
    );
    assert_eq!(res, Uint128::new(50));

    // Query the second before emission end
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800 * 3 - 1,
        },
    );
    assert_eq!(res, Uint128::new(50));

    // Query the second after emission end
    let res: Uint128 = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emission {
            collateral_denom: "uosmo".to_string(),
            incentive_denom: "umars".to_string(),
            timestamp: 604800 * 3,
        },
    );
    assert_eq!(res, Uint128::zero());
}

#[test]
fn query_emissions() {
    let mut deps = th_setup();

    EMISSIONS.save(deps.as_mut().storage, ("uusdc", "umars", 0), &Uint128::new(200)).unwrap();
    EMISSIONS.save(deps.as_mut().storage, ("uusdc", "umars", 604800), &Uint128::new(100)).unwrap();
    EMISSIONS
        .save(deps.as_mut().storage, ("uusdc", "umars", 604800 * 2), &Uint128::new(50))
        .unwrap();

    let res: Vec<EmissionResponse> = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emissions {
            collateral_denom: "uusdc".to_string(),
            incentive_denom: "umars".to_string(),
            start_after_timestamp: None,
            limit: None,
        },
    );
    assert_eq!(
        res,
        vec![
            EmissionResponse::from((0, Uint128::new(200))),
            EmissionResponse::from((604800, Uint128::new(100))),
            EmissionResponse::from((604800 * 2, Uint128::new(50))),
        ]
    );

    let res: Vec<EmissionResponse> = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emissions {
            collateral_denom: "uusdc".to_string(),
            incentive_denom: "umars".to_string(),
            start_after_timestamp: Some(100),
            limit: None,
        },
    );
    assert_eq!(
        res,
        vec![
            EmissionResponse::from((604800, Uint128::new(100))),
            EmissionResponse::from((604800 * 2, Uint128::new(50))),
        ]
    );

    let res: Vec<EmissionResponse> = helpers::th_query(
        deps.as_ref(),
        QueryMsg::Emissions {
            collateral_denom: "uusdc".to_string(),
            incentive_denom: "umars".to_string(),
            start_after_timestamp: Some(604800),
            limit: Some(1),
        },
    );
    assert_eq!(res, vec![EmissionResponse::from((604800 * 2, Uint128::new(50)))]);
}

#[test_case(0 => Vec::<(String, EmissionResponse)>::new() ; "query before emission start")]
#[test_case(604800 => vec![("uosmo".to_string(), EmissionResponse::from((604800, 100)))] ; "query at emission start time")]
#[test_case(604800 + 100 => vec![("uosmo".to_string(), EmissionResponse::from((604800, 100)))] ; "query during first emission")]
#[test_case(604800 * 2 => vec![
        ("umars".to_string(), EmissionResponse::from((604800 * 2, 50))),
        ("uosmo".to_string(), EmissionResponse::from((604800 * 2, 100)))
    ]; "query at second emission start time")]
#[test_case(604800 * 2 + 100 => vec![
        ("umars".to_string(), EmissionResponse::from((604800 * 2, 50))),
        ("uosmo".to_string(), EmissionResponse::from((604800 * 2, 100)))
    ]; "query during second emission")]
#[test_case(604800 * 3 => Vec::<(String, EmissionResponse)>::new() ; "query at emission end time")]
#[test_case(604800 * 3 + 100 => Vec::<(String, EmissionResponse)>::new() ; "query after emission end time")]
fn query_active_emissions(query_at_time: u64) -> Vec<(String, EmissionResponse)> {
    let mut deps = th_setup();

    // Setup incentive states
    INCENTIVE_STATES
        .save(
            deps.as_mut().storage,
            ("uusdc", "uosmo"),
            &IncentiveState {
                index: Decimal::zero(),
                last_updated: 0,
            },
        )
        .unwrap();
    INCENTIVE_STATES
        .save(
            deps.as_mut().storage,
            ("uusdc", "umars"),
            &IncentiveState {
                index: Decimal::zero(),
                last_updated: 0,
            },
        )
        .unwrap();

    // Setup emissions
    EMISSIONS.save(deps.as_mut().storage, ("uusdc", "uosmo", 604800), &Uint128::new(100)).unwrap();
    EMISSIONS
        .save(deps.as_mut().storage, ("uusdc", "umars", 604800 * 2), &Uint128::new(50))
        .unwrap();
    EMISSIONS
        .save(deps.as_mut().storage, ("uusdc", "uosmo", 604800 * 2), &Uint128::new(100))
        .unwrap();

    // Query before emission start
    helpers::th_query_with_env::<Vec<(String, EmissionResponse)>>(
        deps.as_ref(),
        mock_env(MockEnvParams {
            block_time: Timestamp::from_seconds(query_at_time),
            ..Default::default()
        }),
        QueryMsg::ActiveEmissions {
            collateral_denom: "uusdc".to_string(),
        },
    )
}
