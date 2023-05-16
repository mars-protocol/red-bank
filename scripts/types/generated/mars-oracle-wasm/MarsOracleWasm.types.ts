// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

export interface InstantiateMsg {
  base_denom: string
  custom_init?: WasmOracleCustomInitParams | null
  owner: string
}
export interface WasmOracleCustomInitParams {
  astroport_factory: string
}
export type ExecuteMsg =
  | {
      set_price_source: {
        denom: string
        price_source: WasmPriceSourceForString
      }
    }
  | {
      remove_price_source: {
        denom: string
      }
    }
  | {
      update_owner: OwnerUpdate
    }
  | {
      update_config: {
        base_denom?: string | null
      }
    }
  | {
      custom: WasmOracleCustomExecuteMsg
    }
export type WasmPriceSourceForString =
  | {
      fixed: {
        price: Decimal
      }
    }
  | {
      astroport_spot: {
        pair_address: string
        route_assets: string[]
      }
    }
  | {
      astroport_twap: {
        pair_address: string
        route_assets: string[]
        tolerance: number
        window_size: number
      }
    }
export type Decimal = string
export type OwnerUpdate =
  | {
      propose_new_owner: {
        proposed: string
      }
    }
  | 'clear_proposed'
  | 'accept_proposed'
  | 'abolish_owner_role'
export type WasmOracleCustomExecuteMsg = {
  record_twap_snapshots: {
    denoms: string[]
  }
}
export type QueryMsg =
  | {
      config: {}
    }
  | {
      price_source: {
        denom: string
      }
    }
  | {
      price_sources: {
        limit?: number | null
        start_after?: string | null
      }
    }
  | {
      price: {
        denom: string
      }
    }
  | {
      prices: {
        limit?: number | null
        start_after?: string | null
      }
    }
export interface ConfigResponse {
  base_denom: string
  owner?: string | null
  proposed_new_owner?: string | null
}
export interface PriceResponse {
  denom: string
  price: Decimal
}
export interface PriceSourceResponseForString {
  denom: string
  price_source: string
}
export type ArrayOfPriceSourceResponseForString = PriceSourceResponseForString[]
export type ArrayOfPriceResponse = PriceResponse[]
