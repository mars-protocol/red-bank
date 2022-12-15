import { DeploymentConfig, VaultType } from '../../types/config'

const uosmo = 'uosmo'
const uatom = 'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
const udig = 'ibc/307E5C96C8F60D1CBEE269A9A86C0834E1DB06F2B3788AE4F716EDB97A48B97D'
const ucro = 'ibc/E6931F78057F7CC5DA0FD6CEF82FF39373A6E0452BF1FD76910B93292CF356C1'
const gammPool1 = 'gamm/pool/1'

const autoCompoundingVault = 'osmo1lcnpd5000ru7qpd0tz8wnl00rlfvlxvqlw04md9cxsudapd0flvsqke5t5'

export const osmosisTestnetConfig: DeploymentConfig = {
  allowedCoins: [uosmo, uatom, ucro, gammPool1],
  chain: {
    baseDenom: uosmo,
    defaultGasPrice: 0.1,
    id: 'osmo-test-4',
    prefix: 'osmo',
    rpcEndpoint: 'https://rpc-test.osmosis.zone',
  },
  deployerMnemonic:
    'rely wonder join knock during sudden slow plate segment state agree also arrest mandate grief ordinary lonely lawsuit hurt super banana rule velvet cart',
  maxCloseFactor: '0.6',
  maxUnlockingPositions: '10',
  maxValueForBurn: '1000000',
  // Get the latest addresses from: https://github.com/mars-protocol/outposts/blob/master/scripts/deploy/addresses/osmo-test-4.json
  oracle: {
    addr: 'osmo1hkkx42777dyfz7wc8acjjhfdh9x2ugcjvdt7shtft6ha9cn420cquz3u3j',
    vaultPricing: [
      {
        addr: autoCompoundingVault,
        base_denom: gammPool1,
        method: 'preview_redeem',
        vault_coin_denom:
          'factory/osmo1lcnpd5000ru7qpd0tz8wnl00rlfvlxvqlw04md9cxsudapd0flvsqke5t5/cwVTT',
      },
    ],
  },
  redBank: { addr: 'osmo1g30recyv8pfy3qd4qn3dn7plc0rn5z68y5gn32j39e96tjhthzxsw3uvvu' },
  swapRoutes: [
    { denomIn: uosmo, denomOut: uatom, route: [{ token_out_denom: uatom, pool_id: '1' }] },
  ],
  zapper: { addr: 'osmo150dpk65f6deunksn94xtvu249hnr2hwqe335ukucltlwh3uz87hq898s7q' },
  vaults: [
    {
      // https://github.com/apollodao/apollo-config/blob/master/config.json#L114
      vault: { address: autoCompoundingVault },
      config: {
        deposit_cap: { denom: uosmo, amount: '1000000000' },
        liquidation_threshold: '0.75',
        max_ltv: '0.65',
        whitelisted: true,
      },
    },
  ],
  testActions: {
    vault: {
      depositAmount: '1000000',
      withdrawAmount: '1',
      mock: {
        config: {
          deposit_cap: { denom: uosmo, amount: '100000000000' },
          liquidation_threshold: '0.75',
          max_ltv: '0.65',
          whitelisted: true,
        },
        vaultTokenDenom: udig,
        type: VaultType.LOCKED,
        lockup: { time: 3600 }, // 1 hour
        baseToken: { denom: ucro, price: '3' },
      },
    },
    outpostsDeployerMnemonic:
      'elevator august inherit simple buddy giggle zone despair marine rich swim danger blur people hundred faint ladder wet toe strong blade utility trial process',
    borrowAmount: '10',
    repayAmount: '11',
    defaultCreditLine: '100000000000',
    depositAmount: '100',
    secondaryDenom: uatom,
    startingAmountForTestUser: '2000000',
    swap: {
      slippage: '0.4',
      amount: '40',
      route: [
        {
          token_out_denom: uatom,
          pool_id: '1',
        },
      ],
    },
    unzapAmount: '1000000',
    withdrawAmount: '12',
    zap: [
      { denom: uatom, amount: '1', price: '2.135' },
      { denom: uosmo, amount: '3', price: '1' },
    ],
  },
}
