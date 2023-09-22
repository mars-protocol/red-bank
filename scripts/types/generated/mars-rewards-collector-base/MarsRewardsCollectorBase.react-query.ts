// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { StdFee } from '@cosmjs/amino'
import {
  Uint128,
  Decimal,
  InstantiateMsg,
  NeutronIbcConfig,
  Coin,
  ExecuteMsg,
  OwnerUpdate,
  Action,
  ActionAmount,
  UpdateConfig,
  ActionCoin,
  QueryMsg,
  ConfigResponse,
} from './MarsRewardsCollectorBase.types'
import {
  MarsRewardsCollectorBaseQueryClient,
  MarsRewardsCollectorBaseClient,
} from './MarsRewardsCollectorBase.client'
export const marsRewardsCollectorBaseQueryKeys = {
  contract: [
    {
      contract: 'marsRewardsCollectorBase',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...marsRewardsCollectorBaseQueryKeys.contract[0], address: contractAddress }] as const,
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRewardsCollectorBaseQueryKeys.address(contractAddress)[0], method: 'config', args },
    ] as const,
}
export interface MarsRewardsCollectorBaseReactQuery<TResponse, TData = TResponse> {
  client: MarsRewardsCollectorBaseQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface MarsRewardsCollectorBaseConfigQuery<TData>
  extends MarsRewardsCollectorBaseReactQuery<ConfigResponse, TData> {}
export function useMarsRewardsCollectorBaseConfigQuery<TData = ConfigResponse>({
  client,
  options,
}: MarsRewardsCollectorBaseConfigQuery<TData>) {
  return useQuery<ConfigResponse, Error, TData>(
    marsRewardsCollectorBaseQueryKeys.config(client?.contractAddress),
    () => (client ? client.config() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRewardsCollectorBaseClaimIncentiveRewardsMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    limit?: number
    startAfterCollateralDenom?: string
    startAfterIncentiveDenom?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseClaimIncentiveRewardsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseClaimIncentiveRewardsMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseClaimIncentiveRewardsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.claimIncentiveRewards(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseSwapAssetMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    amount?: Uint128
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseSwapAssetMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseSwapAssetMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseSwapAssetMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.swapAsset(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseDistributeRewardsMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    amount?: Uint128
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseDistributeRewardsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseDistributeRewardsMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseDistributeRewardsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.distributeRewards(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseWithdrawFromCreditManagerMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    accountId: string
    actions: Action[]
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseWithdrawFromCreditManagerMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      MarsRewardsCollectorBaseWithdrawFromCreditManagerMutation
    >,
    'mutationFn'
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    MarsRewardsCollectorBaseWithdrawFromCreditManagerMutation
  >(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.withdrawFromCreditManager(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseWithdrawFromRedBankMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    amount?: Uint128
    denom: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseWithdrawFromRedBankMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseWithdrawFromRedBankMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseWithdrawFromRedBankMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.withdrawFromRedBank(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseUpdateConfigMutation {
  client: MarsRewardsCollectorBaseClient
  msg: {
    newCfg: UpdateConfig
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseUpdateConfigMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseUpdateConfigMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseUpdateConfigMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateConfig(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorBaseUpdateOwnerMutation {
  client: MarsRewardsCollectorBaseClient
  msg: OwnerUpdate
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorBaseUpdateOwnerMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorBaseUpdateOwnerMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorBaseUpdateOwnerMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.updateOwner(msg, fee, memo, funds),
    options,
  )
}
