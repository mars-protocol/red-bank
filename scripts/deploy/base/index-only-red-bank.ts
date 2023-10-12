import { setupDeployer } from './setup-deployer'
import { DeploymentConfig } from '../../types/NEW_config'
import { printGreen, printRed } from '../../utils/chalk'

export interface TaskRunnerProps {
  config: DeploymentConfig
  label: string
}

export const taskRunner = async ({ config, label }: TaskRunnerProps) => {
  const deployer = await setupDeployer(config, label)

  try {
    await deployer.saveStorage()
    await deployer.assertDeployerBalance()

    // Upload contracts
    await deployer.upload('redBank', 'mars_red_bank.wasm')
    await deployer.upload('addressProvider', 'mars_address_provider.wasm')
    await deployer.upload('incentives', 'mars_incentives.wasm')
    await deployer.upload('oracle', `mars_oracle_${config.oracle.name}.wasm`)
    await deployer.upload(
      'rewardsCollector',
      `mars_rewards_collector_${config.rewardsCollector.name}.wasm`,
    )
    await deployer.upload('swapper', `mars_swapper_${config.swapper.name}.wasm`)
    await deployer.upload('params', `mars_params.wasm`)

    // Instantiate contracts
    deployer.setOwnerAddr() // TODO can be removed, see index.ts
    await deployer.instantiateAddressProvider()
    await deployer.instantiateRedBank()
    await deployer.instantiateIncentives()
    await deployer.instantiateOracle(config.oracle.customInitParams)
    await deployer.instantiateRewards()
    await deployer.instantiateSwapper()
    await deployer.instantiateParams()
    await deployer.saveDeploymentAddrsToFile(label)

    // setup
    await deployer.updateAddressProvider() // CreditManager address in address-provider should be set once known
    for (const asset of config.assets) {
      await deployer.updateAssetParams(asset)
      await deployer.initializeMarket(asset)
    }
    for (const vault of config.vaults) {
      await deployer.updateVaultConfig(vault)
    }
    await deployer.setRoutes()
    for (const oracleConfig of config.oracleConfigs) {
      await deployer.setOracle(oracleConfig)
    }

    // run tests
    if (config.runTests) {
      await deployer.executeDeposit()
      await deployer.executeBorrow()
      await deployer.executeRepay()
      await deployer.executeWithdraw()
      // await deployer.executeRewardsSwap()
    }

    if (config.multisigAddr) {
      await deployer.updateIncentivesContractOwner()
      await deployer.updateRedBankContractOwner()
      await deployer.updateOracleContractOwner()
      await deployer.updateRewardsContractOwner()
      await deployer.updateSwapperContractOwner()
      await deployer.updateParamsContractOwner()
      await deployer.updateAddressProviderContractOwner()
      printGreen('It is confirmed that all contracts have transferred ownership to the Multisig')
    } else {
      printGreen('Owner remains the deployer address.')
    }
  } catch (e) {
    printRed(e)
  } finally {
    await deployer.saveStorage()
  }
}
