// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export type Uint128 = string
export type Decimal = string
export interface InstantiateMsg {
  address_provider: string
  channel_id: string
  fee_collector_denom: string
  neutron_ibc_config?: NeutronIbcConfig | null
  owner: string
  safety_fund_denom: string
  safety_tax_rate: Decimal
  slippage_tolerance: Decimal
  timeout_seconds: number
}
export interface NeutronIbcConfig {
  acc_fee: Coin[]
  source_port: string
  timeout_fee: Coin[]
}
export interface Coin {
  amount: Uint128
  denom: string
  [k: string]: unknown
}
export type ExecuteMsg =
  | {
      update_owner: OwnerUpdate
    }
  | {
      update_config: {
        new_cfg: UpdateConfig
      }
    }
  | {
      withdraw_from_red_bank: {
        amount?: Uint128 | null
        denom: string
      }
    }
  | {
      withdraw_from_credit_manager: {
        account_id: string
        actions: Action[]
      }
    }
  | {
      distribute_rewards: {
        amount?: Uint128 | null
        denom: string
      }
    }
  | {
      swap_asset: {
        amount?: Uint128 | null
        denom: string
      }
    }
  | {
      claim_incentive_rewards: {
        limit?: number | null
        start_after_collateral_denom?: string | null
        start_after_incentive_denom?: string | null
      }
    }
export type OwnerUpdate =
  | {
      propose_new_owner: {
        proposed: string
      }
    }
  | 'clear_proposed'
  | 'accept_proposed'
  | 'abolish_owner_role'
  | {
      set_emergency_owner: {
        emergency_owner: string
      }
    }
  | 'clear_emergency_owner'
export type Action =
  | {
      deposit: Coin
    }
  | {
      withdraw: ActionCoin
    }
  | {
      borrow: Coin
    }
  | {
      lend: ActionCoin
    }
  | {
      reclaim: ActionCoin
    }
  | {
      claim_rewards: {}
    }
  | {
      repay: {
        coin: ActionCoin
        recipient_account_id?: string | null
      }
    }
  | {
      enter_vault: {
        coin: ActionCoin
        vault: VaultBaseForString
      }
    }
  | {
      exit_vault: {
        amount: Uint128
        vault: VaultBaseForString
      }
    }
  | {
      request_vault_unlock: {
        amount: Uint128
        vault: VaultBaseForString
      }
    }
  | {
      exit_vault_unlocked: {
        id: number
        vault: VaultBaseForString
      }
    }
  | {
      liquidate: {
        debt_coin: Coin
        liquidatee_account_id: string
        request: LiquidateRequestForVaultBaseForString
      }
    }
  | {
      swap_exact_in: {
        coin_in: ActionCoin
        denom_out: string
        slippage: Decimal
      }
    }
  | {
      provide_liquidity: {
        coins_in: ActionCoin[]
        lp_token_out: string
        slippage: Decimal
      }
    }
  | {
      withdraw_liquidity: {
        lp_token: ActionCoin
        slippage: Decimal
      }
    }
  | {
      refund_all_coin_balances: {}
    }
export type ActionAmount =
  | 'account_balance'
  | {
      exact: Uint128
    }
export type LiquidateRequestForVaultBaseForString =
  | {
      deposit: string
    }
  | {
      lend: string
    }
  | {
      vault: {
        position_type: VaultPositionType
        request_vault: VaultBaseForString
      }
    }
export type VaultPositionType = 'u_n_l_o_c_k_e_d' | 'l_o_c_k_e_d' | 'u_n_l_o_c_k_i_n_g'
export interface UpdateConfig {
  address_provider?: string | null
  channel_id?: string | null
  fee_collector_denom?: string | null
  neutron_ibc_config?: NeutronIbcConfig | null
  safety_fund_denom?: string | null
  safety_tax_rate?: Decimal | null
  slippage_tolerance?: Decimal | null
  timeout_seconds?: number | null
}
export interface ActionCoin {
  amount: ActionAmount
  denom: string
}
export interface VaultBaseForString {
  address: string
}
export type QueryMsg = {
  config: {}
}
export interface ConfigResponse {
  address_provider: string
  channel_id: string
  fee_collector_denom: string
  neutron_ibc_config?: NeutronIbcConfig | null
  owner?: string | null
  proposed_new_owner?: string | null
  safety_fund_denom: string
  safety_tax_rate: Decimal
  slippage_tolerance: Decimal
  timeout_seconds: number
}
