// @ts-nocheck
/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { UseQueryOptions, useQuery, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { StdFee, Coin } from '@cosmjs/amino'
import {
  InstantiateMsg,
  CreateOrUpdateConfig,
  ExecuteMsg,
  OwnerUpdate,
  Decimal,
  Uint128,
  MigrateV1ToV2,
  InitOrUpdateAssetParams,
  InterestRateModel,
  QueryMsg,
  ConfigResponse,
  Market,
  ArrayOfMarket,
  UserCollateralResponse,
  ArrayOfUserCollateralResponse,
  PaginationResponseForUserCollateralResponse,
  Metadata,
  UserDebtResponse,
  ArrayOfUserDebtResponse,
  UserHealthStatus,
  UserPositionResponse,
} from './MarsRedBank.types'
import { MarsRedBankQueryClient, MarsRedBankClient } from './MarsRedBank.client'
export const marsRedBankQueryKeys = {
  contract: [
    {
      contract: 'marsRedBank',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...marsRedBankQueryKeys.contract[0], address: contractAddress }] as const,
  config: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'config', args }] as const,
  market: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'market', args }] as const,
  markets: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'markets', args }] as const,
  userDebt: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_debt', args }] as const,
  userDebts: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [{ ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_debts', args }] as const,
  userCollateral: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_collateral', args },
    ] as const,
  userCollaterals: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_collaterals', args },
    ] as const,
  userCollateralsV2: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_collaterals_v2', args },
    ] as const,
  userPosition: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'user_position', args },
    ] as const,
  userPositionLiquidationPricing: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...marsRedBankQueryKeys.address(contractAddress)[0],
        method: 'user_position_liquidation_pricing',
        args,
      },
    ] as const,
  scaledLiquidityAmount: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsRedBankQueryKeys.address(contractAddress)[0],
        method: 'scaled_liquidity_amount',
        args,
      },
    ] as const,
  scaledDebtAmount: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...marsRedBankQueryKeys.address(contractAddress)[0], method: 'scaled_debt_amount', args },
    ] as const,
  underlyingLiquidityAmount: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>,
  ) =>
    [
      {
        ...marsRedBankQueryKeys.address(contractAddress)[0],
        method: 'underlying_liquidity_amount',
        args,
      },
    ] as const,
  underlyingDebtAmount: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      {
        ...marsRedBankQueryKeys.address(contractAddress)[0],
        method: 'underlying_debt_amount',
        args,
      },
    ] as const,
}
export interface MarsRedBankReactQuery<TResponse, TData = TResponse> {
  client: MarsRedBankQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface MarsRedBankUnderlyingDebtAmountQuery<TData>
  extends MarsRedBankReactQuery<Uint128, TData> {
  args: {
    amountScaled: Uint128
    denom: string
  }
}
export function useMarsRedBankUnderlyingDebtAmountQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsRedBankUnderlyingDebtAmountQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsRedBankQueryKeys.underlyingDebtAmount(client?.contractAddress, args),
    () =>
      client
        ? client.underlyingDebtAmount({
            amountScaled: args.amountScaled,
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUnderlyingLiquidityAmountQuery<TData>
  extends MarsRedBankReactQuery<Uint128, TData> {
  args: {
    amountScaled: Uint128
    denom: string
  }
}
export function useMarsRedBankUnderlyingLiquidityAmountQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsRedBankUnderlyingLiquidityAmountQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsRedBankQueryKeys.underlyingLiquidityAmount(client?.contractAddress, args),
    () =>
      client
        ? client.underlyingLiquidityAmount({
            amountScaled: args.amountScaled,
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankScaledDebtAmountQuery<TData>
  extends MarsRedBankReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
    denom: string
  }
}
export function useMarsRedBankScaledDebtAmountQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsRedBankScaledDebtAmountQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsRedBankQueryKeys.scaledDebtAmount(client?.contractAddress, args),
    () =>
      client
        ? client.scaledDebtAmount({
            amount: args.amount,
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankScaledLiquidityAmountQuery<TData>
  extends MarsRedBankReactQuery<Uint128, TData> {
  args: {
    amount: Uint128
    denom: string
  }
}
export function useMarsRedBankScaledLiquidityAmountQuery<TData = Uint128>({
  client,
  args,
  options,
}: MarsRedBankScaledLiquidityAmountQuery<TData>) {
  return useQuery<Uint128, Error, TData>(
    marsRedBankQueryKeys.scaledLiquidityAmount(client?.contractAddress, args),
    () =>
      client
        ? client.scaledLiquidityAmount({
            amount: args.amount,
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserPositionLiquidationPricingQuery<TData>
  extends MarsRedBankReactQuery<UserPositionResponse, TData> {
  args: {
    accountId?: string
    user: string
  }
}
export function useMarsRedBankUserPositionLiquidationPricingQuery<TData = UserPositionResponse>({
  client,
  args,
  options,
}: MarsRedBankUserPositionLiquidationPricingQuery<TData>) {
  return useQuery<UserPositionResponse, Error, TData>(
    marsRedBankQueryKeys.userPositionLiquidationPricing(client?.contractAddress, args),
    () =>
      client
        ? client.userPositionLiquidationPricing({
            accountId: args.accountId,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserPositionQuery<TData>
  extends MarsRedBankReactQuery<UserPositionResponse, TData> {
  args: {
    accountId?: string
    user: string
  }
}
export function useMarsRedBankUserPositionQuery<TData = UserPositionResponse>({
  client,
  args,
  options,
}: MarsRedBankUserPositionQuery<TData>) {
  return useQuery<UserPositionResponse, Error, TData>(
    marsRedBankQueryKeys.userPosition(client?.contractAddress, args),
    () =>
      client
        ? client.userPosition({
            accountId: args.accountId,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserCollateralsV2Query<TData>
  extends MarsRedBankReactQuery<PaginationResponseForUserCollateralResponse, TData> {
  args: {
    accountId?: string
    limit?: number
    startAfter?: string
    user: string
  }
}
export function useMarsRedBankUserCollateralsV2Query<
  TData = PaginationResponseForUserCollateralResponse,
>({ client, args, options }: MarsRedBankUserCollateralsV2Query<TData>) {
  return useQuery<PaginationResponseForUserCollateralResponse, Error, TData>(
    marsRedBankQueryKeys.userCollateralsV2(client?.contractAddress, args),
    () =>
      client
        ? client.userCollateralsV2({
            accountId: args.accountId,
            limit: args.limit,
            startAfter: args.startAfter,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserCollateralsQuery<TData>
  extends MarsRedBankReactQuery<ArrayOfUserCollateralResponse, TData> {
  args: {
    accountId?: string
    limit?: number
    startAfter?: string
    user: string
  }
}
export function useMarsRedBankUserCollateralsQuery<TData = ArrayOfUserCollateralResponse>({
  client,
  args,
  options,
}: MarsRedBankUserCollateralsQuery<TData>) {
  return useQuery<ArrayOfUserCollateralResponse, Error, TData>(
    marsRedBankQueryKeys.userCollaterals(client?.contractAddress, args),
    () =>
      client
        ? client.userCollaterals({
            accountId: args.accountId,
            limit: args.limit,
            startAfter: args.startAfter,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserCollateralQuery<TData>
  extends MarsRedBankReactQuery<UserCollateralResponse, TData> {
  args: {
    accountId?: string
    denom: string
    user: string
  }
}
export function useMarsRedBankUserCollateralQuery<TData = UserCollateralResponse>({
  client,
  args,
  options,
}: MarsRedBankUserCollateralQuery<TData>) {
  return useQuery<UserCollateralResponse, Error, TData>(
    marsRedBankQueryKeys.userCollateral(client?.contractAddress, args),
    () =>
      client
        ? client.userCollateral({
            accountId: args.accountId,
            denom: args.denom,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserDebtsQuery<TData>
  extends MarsRedBankReactQuery<ArrayOfUserDebtResponse, TData> {
  args: {
    limit?: number
    startAfter?: string
    user: string
  }
}
export function useMarsRedBankUserDebtsQuery<TData = ArrayOfUserDebtResponse>({
  client,
  args,
  options,
}: MarsRedBankUserDebtsQuery<TData>) {
  return useQuery<ArrayOfUserDebtResponse, Error, TData>(
    marsRedBankQueryKeys.userDebts(client?.contractAddress, args),
    () =>
      client
        ? client.userDebts({
            limit: args.limit,
            startAfter: args.startAfter,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankUserDebtQuery<TData>
  extends MarsRedBankReactQuery<UserDebtResponse, TData> {
  args: {
    denom: string
    user: string
  }
}
export function useMarsRedBankUserDebtQuery<TData = UserDebtResponse>({
  client,
  args,
  options,
}: MarsRedBankUserDebtQuery<TData>) {
  return useQuery<UserDebtResponse, Error, TData>(
    marsRedBankQueryKeys.userDebt(client?.contractAddress, args),
    () =>
      client
        ? client.userDebt({
            denom: args.denom,
            user: args.user,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankMarketsQuery<TData>
  extends MarsRedBankReactQuery<ArrayOfMarket, TData> {
  args: {
    limit?: number
    startAfter?: string
  }
}
export function useMarsRedBankMarketsQuery<TData = ArrayOfMarket>({
  client,
  args,
  options,
}: MarsRedBankMarketsQuery<TData>) {
  return useQuery<ArrayOfMarket, Error, TData>(
    marsRedBankQueryKeys.markets(client?.contractAddress, args),
    () =>
      client
        ? client.markets({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankMarketQuery<TData> extends MarsRedBankReactQuery<Market, TData> {
  args: {
    denom: string
  }
}
export function useMarsRedBankMarketQuery<TData = Market>({
  client,
  args,
  options,
}: MarsRedBankMarketQuery<TData>) {
  return useQuery<Market, Error, TData>(
    marsRedBankQueryKeys.market(client?.contractAddress, args),
    () =>
      client
        ? client.market({
            denom: args.denom,
          })
        : Promise.reject(new Error('Invalid client')),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankConfigQuery<TData>
  extends MarsRedBankReactQuery<ConfigResponse, TData> {}
export function useMarsRedBankConfigQuery<TData = ConfigResponse>({
  client,
  options,
}: MarsRedBankConfigQuery<TData>) {
  return useQuery<ConfigResponse, Error, TData>(
    marsRedBankQueryKeys.config(client?.contractAddress),
    () => (client ? client.config() : Promise.reject(new Error('Invalid client'))),
    { ...options, enabled: !!client && (options?.enabled != undefined ? options.enabled : true) },
  )
}
export interface MarsRedBankMigrateMutation {
  client: MarsRedBankClient
  msg: MigrateV1ToV2
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankMigrateMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankMigrateMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankMigrateMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.migrate(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankUpdateAssetCollateralStatusMutation {
  client: MarsRedBankClient
  msg: {
    denom: string
    enable: boolean
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankUpdateAssetCollateralStatusMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankUpdateAssetCollateralStatusMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankUpdateAssetCollateralStatusMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateAssetCollateralStatus(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankLiquidateMutation {
  client: MarsRedBankClient
  msg: {
    collateralDenom: string
    recipient?: string
    user: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankLiquidateMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankLiquidateMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankLiquidateMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.liquidate(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankRepayMutation {
  client: MarsRedBankClient
  msg: {
    onBehalfOf?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankRepayMutation(
  options?: Omit<UseMutationOptions<ExecuteResult, Error, MarsRedBankRepayMutation>, 'mutationFn'>,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankRepayMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.repay(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankBorrowMutation {
  client: MarsRedBankClient
  msg: {
    amount: Uint128
    denom: string
    recipient?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankBorrowMutation(
  options?: Omit<UseMutationOptions<ExecuteResult, Error, MarsRedBankBorrowMutation>, 'mutationFn'>,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankBorrowMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.borrow(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankWithdrawMutation {
  client: MarsRedBankClient
  msg: {
    accountId?: string
    amount?: Uint128
    denom: string
    liquidationRelated?: boolean
    recipient?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankWithdrawMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankWithdrawMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankWithdrawMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.withdraw(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankDepositMutation {
  client: MarsRedBankClient
  msg: {
    accountId?: string
    onBehalfOf?: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankDepositMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankDepositMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankDepositMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.deposit(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankUpdateAssetMutation {
  client: MarsRedBankClient
  msg: {
    denom: string
    params: InitOrUpdateAssetParams
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankUpdateAssetMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankUpdateAssetMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankUpdateAssetMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.updateAsset(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankInitAssetMutation {
  client: MarsRedBankClient
  msg: {
    denom: string
    params: InitOrUpdateAssetParams
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankInitAssetMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankInitAssetMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankInitAssetMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.initAsset(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankUpdateConfigMutation {
  client: MarsRedBankClient
  msg: {
    config: CreateOrUpdateConfig
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankUpdateConfigMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankUpdateConfigMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankUpdateConfigMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateConfig(msg, fee, memo, funds),
    options,
  )
}
export interface MarsRedBankUpdateOwnerMutation {
  client: MarsRedBankClient
  msg: OwnerUpdate
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useMarsRedBankUpdateOwnerMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, MarsRedBankUpdateOwnerMutation>,
    'mutationFn'
  >,
) {
  return useMutation<ExecuteResult, Error, MarsRedBankUpdateOwnerMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) => client.updateOwner(msg, fee, memo, funds),
    options,
  )
}
