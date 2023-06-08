// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.30.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { StdFee, Coin } from '@cosmjs/amino'
import {
  Decimal,
  InstantiateMsg,
  ExecuteMsg,
  OwnerUpdate,
  OsmosisRoute,
  Uint128,
  UpdateConfig,
  SwapAmountInRoute,
  QueryMsg,
  ConfigResponse,
  RouteResponseForString,
  ArrayOfRouteResponseForString,
} from './MarsRewardsCollectorOsmosis.types'
import {
  MarsRewardsCollectorOsmosisQueryClient,
  MarsRewardsCollectorOsmosisClient,
} from './MarsRewardsCollectorOsmosis.client'
export const marsRewardsCollectorOsmosisQueryKeys = {
  contract: [
    {
      contract: 'marsRewardsCollectorOsmosis',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...marsRewardsCollectorOsmosisQueryKeys.contract[0], address: contractAddress }] as const,
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsRewardsCollectorOsmosisQueryKeys.address(contractAddress)[0],
        method: 'config',
        args,
      },
    ] as const,
  route: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsRewardsCollectorOsmosisQueryKeys.address(contractAddress)[0],
        method: 'route',
        args,
      },
    ] as const,
  routes: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsRewardsCollectorOsmosisQueryKeys.address(contractAddress)[0],
        method: 'routes',
        args,
      },
    ] as const,
}
export interface MarsRewardsCollectorOsmosisReactQuery<TResponse, TData = TResponse> {
  client: MarsRewardsCollectorOsmosisQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface MarsRewardsCollectorOsmosisRoutesQuery<TData>
  extends MarsRewardsCollectorOsmosisReactQuery<ArrayOfRouteResponseForString, TData> {
  args: {
    limit?: number
    startAfter?: string[][]
  }
}
export function useMarsRewardsCollectorOsmosisRoutesQuery<TData = ArrayOfRouteResponseForString>({
  client,
  args,
  options,
}: MarsRewardsCollectorOsmosisRoutesQuery<TData>) {
  return useQuery<ArrayOfRouteResponseForString, Error, TData>(
    marsRewardsCollectorOsmosisQueryKeys.routes(client?.contractAddress, args),
    () =>
      client
        ? client.routes({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRewardsCollectorOsmosisRouteQuery<TData>
  extends MarsRewardsCollectorOsmosisReactQuery<RouteResponseForString, TData> {
  args: {
    denomIn: string
    denomOut: string
  }
}
export function useMarsRewardsCollectorOsmosisRouteQuery<TData = RouteResponseForString>({
  client,
  args,
  options,
}: MarsRewardsCollectorOsmosisRouteQuery<TData>) {
  return useQuery<RouteResponseForString, Error, TData>(
    marsRewardsCollectorOsmosisQueryKeys.route(client?.contractAddress, args),
    () =>
      client
        ? client.route({
            denomIn: args.denomIn,
            denomOut: args.denomOut,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRewardsCollectorOsmosisConfigQuery<TData>
  extends MarsRewardsCollectorOsmosisReactQuery<ConfigResponse, TData> {}
export function useMarsRewardsCollectorOsmosisConfigQuery<TData = ConfigResponse>({
  client,
  options,
}: MarsRewardsCollectorOsmosisConfigQuery<TData>) {
  return useQuery<ConfigResponse, Error, TData>(
    marsRewardsCollectorOsmosisQueryKeys.config(client?.contractAddress),
    () => (client ? client.config() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRewardsCollectorOsmosisClaimIncentiveRewardsMutation {
  client: MarsRewardsCollectorOsmosisClient
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorOsmosisClaimIncentiveRewardsMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      MarsRewardsCollectorOsmosisClaimIncentiveRewardsMutation
    >,
    'mutationFn'
  >,
) {
  return useMutation<
    ExecuteResult,
    Error,
    MarsRewardsCollectorOsmosisClaimIncentiveRewardsMutation
  >(
    ({ client, args: { fee, memo, funds } = {} }) => client.claimIncentiveRewards(fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisSwapAssetMutation {
  client: MarsRewardsCollectorOsmosisClient
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
export function useMarsRewardsCollectorOsmosisSwapAssetMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorOsmosisSwapAssetMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisSwapAssetMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.swapAsset(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisDistributeRewardsMutation {
  client: MarsRewardsCollectorOsmosisClient
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
export function useMarsRewardsCollectorOsmosisDistributeRewardsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorOsmosisDistributeRewardsMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisDistributeRewardsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.distributeRewards(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisWithdrawFromRedBankMutation {
  client: MarsRewardsCollectorOsmosisClient
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
export function useMarsRewardsCollectorOsmosisWithdrawFromRedBankMutation(
  options?: Omit<
    UseMutationOptions<
      ExecuteResult,
      Error,
      MarsRewardsCollectorOsmosisWithdrawFromRedBankMutation
    >,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisWithdrawFromRedBankMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.withdrawFromRedBank(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisSetRouteMutation {
  client: MarsRewardsCollectorOsmosisClient
  msg: {
    denomIn: string
    denomOut: string
    route: OsmosisRoute
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorOsmosisSetRouteMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorOsmosisSetRouteMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisSetRouteMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.setRoute(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisUpdateConfigMutation {
  client: MarsRewardsCollectorOsmosisClient
  msg: {
    newCfg: UpdateConfig
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorOsmosisUpdateConfigMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorOsmosisUpdateConfigMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisUpdateConfigMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateConfig(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRewardsCollectorOsmosisUpdateOwnerMutation {
  client: MarsRewardsCollectorOsmosisClient
  msg: OwnerUpdate
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRewardsCollectorOsmosisUpdateOwnerMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRewardsCollectorOsmosisUpdateOwnerMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRewardsCollectorOsmosisUpdateOwnerMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.updateOwner(msg, fee, memo, funds),
    options,
  )
}
