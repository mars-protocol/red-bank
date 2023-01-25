// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.24.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { MsgExecuteContractEncodeObject } from 'cosmwasm'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import {
  InstantiateMsg,
  ExecuteMsg,
  Decimal,
  Uint128,
  HealthResponse,
  QueryMsg,
  VaultBaseForString,
  Coin,
  ArrayOfCoinBalanceResponseItem,
  CoinBalanceResponseItem,
  ArrayOfSharesResponseItem,
  SharesResponseItem,
  ArrayOfDebtShares,
  DebtShares,
  ArrayOfLentShares,
  LentShares,
  Addr,
  ArrayOfVaultWithBalance,
  VaultWithBalance,
  VaultBaseForAddr,
  VaultPositionAmount,
  VaultAmount,
  VaultAmount1,
  UnlockingPositions,
  ArrayOfVaultPositionResponseItem,
  VaultPositionResponseItem,
  VaultPosition,
  LockingVaultAmount,
  VaultUnlockingPosition,
  ArrayOfString,
  ConfigResponse,
  ArrayOfCoin,
  Positions,
  DebtAmount,
  LentAmount,
  ArrayOfVaultInfoResponse,
  VaultInfoResponse,
  VaultConfig,
} from './MarsMockCreditManager.types'
export interface MarsMockCreditManagerMessage {
  contractAddress: string
  sender: string
  setHealthResponse: (
    {
      accountId,
      response,
    }: {
      accountId: string
      response: HealthResponse
    },
    funds?: Coin[],
  ) => MsgExecuteContractEncodeObject
}
export class MarsMockCreditManagerMessageComposer implements MarsMockCreditManagerMessage {
  sender: string
  contractAddress: string

  constructor(sender: string, contractAddress: string) {
    this.sender = sender
    this.contractAddress = contractAddress
    this.setHealthResponse = this.setHealthResponse.bind(this)
  }

  setHealthResponse = (
    {
      accountId,
      response,
    }: {
      accountId: string
      response: HealthResponse
    },
    funds?: Coin[],
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            set_health_response: {
              account_id: accountId,
              response,
            },
          }),
        ),
        funds,
      }),
    }
  }
}
