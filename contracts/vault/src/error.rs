use cosmwasm_std::{
    CheckedFromRatioError, CheckedMultiplyFractionError, CheckedMultiplyRatioError,
    DecimalRangeExceeded, DivideByZeroError, OverflowError, StdError,
};
use cw_utils::PaymentError;
use mars_owner::OwnerError;

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum ContractError {
    #[error(transparent)]
    Std(#[from] StdError),

    #[error(transparent)]
    Overflow(#[from] OverflowError),

    #[error(transparent)]
    CheckedFromRatio(#[from] CheckedFromRatioError),

    #[error(transparent)]
    CheckedMultiplyRatio(#[from] CheckedMultiplyRatioError),

    #[error(transparent)]
    CheckedMultiplyFraction(#[from] CheckedMultiplyFractionError),

    #[error(transparent)]
    DecimalRangeExceeded(#[from] DecimalRangeExceeded),

    #[error(transparent)]
    DivideByZeroError(#[from] DivideByZeroError),

    #[error(transparent)]
    Owner(#[from] OwnerError),

    #[error(transparent)]
    Payment(#[from] PaymentError),

    #[error("{0}")]
    Generic(String),

    #[error("Caller is not the Credit Manager contract")]
    NotCreditManager {},

    #[error("Credit Manager account not found")]
    CreditManagerAccountNotFound {},

    #[error("Credit Manager account exists. Only one binding allowed.")]
    CreditManagerAccountExists {},
}

pub type ContractResult<T> = Result<T, ContractError>;

impl From<&str> for ContractError {
    fn from(val: &str) -> Self {
        ContractError::Generic(val.into())
    }
}
