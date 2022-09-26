// @ts-nocheck
/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.16.5.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Decimal, InstantiateMsg, ExecuteMsg, OsmosisRoute, Uint128, CosmosMsgForEmpty, BankMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, CreateOrUpdateConfig, SwapAmountInRoute, Coin, Empty, IbcTimeout, IbcTimeoutBlock, QueryMsg, ConfigForString, RouteResponseForString, ArrayOfRouteResponseForString } from "./MarsRewardsCollectorOsmosis.types";
export interface MarsRewardsCollectorOsmosisReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<ConfigForString>;
  route: ({
    denomIn,
    denomOut
  }: {
    denomIn: string;
    denomOut: string;
  }) => Promise<RouteResponseForString>;
  routes: ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string[][];
  }) => Promise<ArrayOfRouteResponseForString>;
}
export class MarsRewardsCollectorOsmosisQueryClient implements MarsRewardsCollectorOsmosisReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;

  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.route = this.route.bind(this);
    this.routes = this.routes.bind(this);
  }

  config = async (): Promise<ConfigForString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  route = async ({
    denomIn,
    denomOut
  }: {
    denomIn: string;
    denomOut: string;
  }): Promise<RouteResponseForString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      route: {
        denom_in: denomIn,
        denom_out: denomOut
      }
    });
  };
  routes = async ({
    limit,
    startAfter
  }: {
    limit?: number;
    startAfter?: string[][];
  }): Promise<ArrayOfRouteResponseForString> => {
    return this.client.queryContractSmart(this.contractAddress, {
      routes: {
        limit,
        start_after: startAfter
      }
    });
  };
}
export interface MarsRewardsCollectorOsmosisInterface extends MarsRewardsCollectorOsmosisReadOnlyInterface {
  contractAddress: string;
  sender: string;
  updateConfig: ({
    newCfg
  }: {
    newCfg: CreateOrUpdateConfig;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  setRoute: ({
    denomIn,
    denomOut,
    route
  }: {
    denomIn: string;
    denomOut: string;
    route: OsmosisRoute;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  withdrawFromRedBank: ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  distributeRewards: ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  swapAsset: ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
  executeCosmosMsg: ({
    cosmosMsg
  }: {
    cosmosMsg: CosmosMsgForEmpty;
  }, fee?: number | StdFee | "auto", memo?: string, funds?: Coin[]) => Promise<ExecuteResult>;
}
export class MarsRewardsCollectorOsmosisClient extends MarsRewardsCollectorOsmosisQueryClient implements MarsRewardsCollectorOsmosisInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;

  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.updateConfig = this.updateConfig.bind(this);
    this.setRoute = this.setRoute.bind(this);
    this.withdrawFromRedBank = this.withdrawFromRedBank.bind(this);
    this.distributeRewards = this.distributeRewards.bind(this);
    this.swapAsset = this.swapAsset.bind(this);
    this.executeCosmosMsg = this.executeCosmosMsg.bind(this);
  }

  updateConfig = async ({
    newCfg
  }: {
    newCfg: CreateOrUpdateConfig;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_config: {
        new_cfg: newCfg
      }
    }, fee, memo, funds);
  };
  setRoute = async ({
    denomIn,
    denomOut,
    route
  }: {
    denomIn: string;
    denomOut: string;
    route: OsmosisRoute;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_route: {
        denom_in: denomIn,
        denom_out: denomOut,
        route
      }
    }, fee, memo, funds);
  };
  withdrawFromRedBank = async ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      withdraw_from_red_bank: {
        amount,
        denom
      }
    }, fee, memo, funds);
  };
  distributeRewards = async ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      distribute_rewards: {
        amount,
        denom
      }
    }, fee, memo, funds);
  };
  swapAsset = async ({
    amount,
    denom
  }: {
    amount?: Uint128;
    denom: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      swap_asset: {
        amount,
        denom
      }
    }, fee, memo, funds);
  };
  executeCosmosMsg = async ({
    cosmosMsg
  }: {
    cosmosMsg: CosmosMsgForEmpty;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      execute_cosmos_msg: {
        cosmos_msg: cosmosMsg
      }
    }, fee, memo, funds);
  };
}