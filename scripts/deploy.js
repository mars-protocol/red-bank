var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config.js';
import { deployContract, executeContract, instantiateContract, queryContract, recover, setTimeoutDuration, setupOracle, setupRedBank, uploadContract, } from './helpers.js';
import { LCDClient, LocalTerra } from '@terra-money/terra.js';
import { testnet, local } from './deploy_configs.js';
import { join } from 'path';
// consts
const MARS_ARTIFACTS_PATH = '../artifacts';
// main
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let terra;
        let wallet;
        let deployConfig;
        const isTestnet = process.env.NETWORK === 'testnet';
        if (process.env.NETWORK === 'testnet') {
            terra = new LCDClient({
                URL: 'https://bombay-lcd.terra.dev',
                chainID: 'bombay-12',
            });
            wallet = recover(terra, process.env.TEST_MAIN);
            deployConfig = testnet;
        }
        else {
            terra = new LocalTerra();
            wallet = terra.wallets.test1;
            setTimeoutDuration(0);
            deployConfig = local;
        }
        console.log(`Wallet address from seed: ${wallet.key.accAddress}`);
        /*************************************** Validate deploy config file *****************************************/
        if (!deployConfig.minterProxyContractAddress) {
            console.log(`Please deploy CW1-Whitelist proxy contract set as the MARS tokens minter address,
                use the same deploy address as "Wallet address from seed" above
                and then set this address in the deploy config before running this script...`);
            return;
        }
        if (!deployConfig.marsTokenContractAddress) {
            console.log(`Please deploy the CW20-base MARS token,
                and then set this address in the deploy config before running this script...`);
            return;
        }
        if (!deployConfig.oracleFactoryAddress) {
            console.log('Please specify the oracle price source (TerraSwap/Astroport) in the deploy config before running this script...');
            return;
        }
        if (!deployConfig.stakingInitMsg.config.astroport_factory_address ||
            !deployConfig.safetyFundInitMsg.astroport_factory_address ||
            !deployConfig.protocolRewardsCollectorInitMsg.config.astroport_factory_address) {
            console.log('Please specify the TerraSwap/Astroport factory addresses in the deploy config before running this script...');
            return;
        }
        /*************************************** Deploy Address Provider Contract *****************************************/
        console.log('Deploying Address Provider...');
        const addressProviderContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_address_provider.wasm'), { owner: wallet.key.accAddress });
        console.log('Address Provider Contract Address: ' + addressProviderContractAddress);
        /*************************************** Deploy Council Contract *****************************************/
        console.log('Deploying council...');
        deployConfig.councilInitMsg.config.address_provider_address = addressProviderContractAddress;
        const councilContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_council.wasm'), deployConfig.councilInitMsg);
        console.log('Council Contract Address: ' + councilContractAddress);
        /*************************************** Set Council as MARS Tokens Minter *****************************************/
        console.log('Setting council to MARS tokens minter...');
        yield executeContract(terra, wallet, deployConfig.minterProxyContractAddress, {
            update_admins: {
                admins: isTestnet ? [wallet.key.accAddress, councilContractAddress] : [councilContractAddress],
            },
        });
        console.log('Council set to MARS token minter admin role: ', yield queryContract(terra, deployConfig.minterProxyContractAddress, { admin_list: {} }));
        /*************************************** Deploy Vesting Contract *****************************************/
        console.log('Deploying vesting...');
        deployConfig.vestingInitMsg.address_provider_address = addressProviderContractAddress;
        const vestingContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_vesting.wasm'), deployConfig.vestingInitMsg);
        console.log('Vesting Contract Address: ' + vestingContractAddress);
        /**************************************** Deploy Staking Contract *****************************************/
        console.log('Deploying Staking...');
        // TODO fix `astroport_factory_address` in LocalTerra
        deployConfig.stakingInitMsg.config.owner = councilContractAddress;
        deployConfig.stakingInitMsg.config.address_provider_address = addressProviderContractAddress;
        const stakingContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_staking.wasm'), deployConfig.stakingInitMsg);
        console.log('Staking Contract Address: ' + stakingContractAddress);
        /************************************* Deploy Safety Fund Contract *************************************/
        console.log('Deploying Safety Fund...');
        deployConfig.safetyFundInitMsg.owner = councilContractAddress;
        const safetyFundContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_safety_fund.wasm'), deployConfig.safetyFundInitMsg);
        console.log('Safety Fund Contract Address: ' + safetyFundContractAddress);
        /**************************************** Deploy Treasury Contract ****************************************/
        console.log('Deploying Treasury...');
        deployConfig.treasuryInitMsg.owner = councilContractAddress;
        const treasuryContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_treasury.wasm'), deployConfig.treasuryInitMsg);
        console.log('Treasury Contract Address: ' + treasuryContractAddress);
        /**************************************** Deploy Incentives Contract ****************************************/
        console.log('Deploying Incentives...');
        const incentivesContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_incentives.wasm'), {
            owner: councilContractAddress,
            address_provider_address: addressProviderContractAddress,
        });
        console.log('Incentives Contract Address: ' + incentivesContractAddress);
        /************************************* Instantiate xMars Token Contract *************************************/
        console.log('Deploying xMars token...');
        const xMarsTokenCodeId = yield uploadContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_xmars_token.wasm'));
        console.log(`Uploaded xMars token contract, code: ${xMarsTokenCodeId}`);
        const xMarsTokenContractAddress = yield instantiateContract(terra, wallet, xMarsTokenCodeId, {
            name: 'xMars token',
            symbol: 'xMars',
            decimals: 6,
            initial_balances: [],
            mint: { minter: stakingContractAddress },
        });
        console.log('xMars Token Contract Address: ' + xMarsTokenContractAddress);
        /************************************* Upload ma_token Token Contract *************************************/
        console.log('Uploading ma_token contract');
        const maTokenCodeId = yield uploadContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_ma_token.wasm'));
        console.log(`Uploaded ma_token contract code: ${maTokenCodeId}`);
        /************************************* Deploy Protocol Rewards Collector Contract *************************************/
        console.log('Deploying Protocol Rewards Collector...');
        deployConfig.protocolRewardsCollectorInitMsg.config.owner = wallet.key.accAddress;
        deployConfig.protocolRewardsCollectorInitMsg.config.address_provider_address = addressProviderContractAddress;
        const protocolRewardsCollectorContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_protocol_rewards_collector.wasm'), deployConfig.protocolRewardsCollectorInitMsg);
        console.log('Protocol Rewards Collector Contract Address: ' + protocolRewardsCollectorContractAddress);
        /************************************* Setup protocol reward collector enabled assets *************************************/
        console.log('Enable uusd on Protocol Rewards Collector...');
        yield executeContract(terra, wallet, protocolRewardsCollectorContractAddress, {
            update_asset_config: {
                asset: { native: { denom: 'uusd' } },
                enabled: true,
            },
        });
        console.log('uusd enabled');
        /************************************* Update owner to council in Protocol Rewards Collector Contract *************************************/
        yield executeContract(terra, wallet, protocolRewardsCollectorContractAddress, {
            update_config: {
                config: {
                    owner: councilContractAddress,
                },
            },
        });
        console.log('Protocol Rewards Collector owner successfully changed: ', yield queryContract(terra, protocolRewardsCollectorContractAddress, { config: {} }));
        /************************************* Deploy Red Bank Contract *************************************/
        console.log('Deploying Red Bank...');
        deployConfig.redBankInitMsg.config.owner = wallet.key.accAddress;
        deployConfig.redBankInitMsg.config.address_provider_address = addressProviderContractAddress;
        deployConfig.redBankInitMsg.config.ma_token_code_id = maTokenCodeId;
        const redBankContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_red_bank.wasm'), deployConfig.redBankInitMsg);
        console.log(`Red Bank Contract Address: ${redBankContractAddress}`);
        /*************************************** Deploy Oracle Contract *****************************************/
        console.log('Deploying Oracle...');
        const oracleContractAddress = yield deployContract(terra, wallet, join(MARS_ARTIFACTS_PATH, 'mars_oracle.wasm'), {
            owner: wallet.key.accAddress,
        });
        console.log('Oracle Contract Address: ' + oracleContractAddress);
        /**************************************** Update Config in Address Provider Contract *****************************************/
        console.log('Setting addresses in address provider');
        yield executeContract(terra, wallet, addressProviderContractAddress, {
            update_config: {
                config: {
                    owner: councilContractAddress,
                    council_address: councilContractAddress,
                    incentives_address: incentivesContractAddress,
                    safety_fund_address: safetyFundContractAddress,
                    mars_token_address: deployConfig.marsTokenContractAddress,
                    oracle_address: oracleContractAddress,
                    protocol_admin_address: wallet.key.accAddress,
                    protocol_rewards_collector_address: protocolRewardsCollectorContractAddress,
                    red_bank_address: redBankContractAddress,
                    staking_address: stakingContractAddress,
                    treasury_address: treasuryContractAddress,
                    vesting_address: vestingContractAddress,
                    xmars_token_address: xMarsTokenContractAddress,
                },
            },
        });
        console.log('Address Provider config successfully setup: ', yield queryContract(terra, addressProviderContractAddress, { config: {} }));
        /*************************************** Setup Oracle Assets *****************************************/
        yield setupOracle(terra, wallet, oracleContractAddress, deployConfig.initialAssets, deployConfig.oracleFactoryAddress, isTestnet);
        console.log('Assets oracle price feed setup successfully');
        let updateConfigMsg = {
            update_config: {
                owner: councilContractAddress,
            },
        };
        yield executeContract(terra, wallet, oracleContractAddress, updateConfigMsg);
        console.log('Oracle owner successfully changed: ', yield queryContract(terra, oracleContractAddress, { config: {} }));
        /************************************* Setup Initial Red Bank Markets **************************************/
        yield setupRedBank(terra, wallet, redBankContractAddress, {
            initialAssets: deployConfig.initialAssets,
        });
        console.log('Initial assets setup successfully');
        // Add some uncollateralised loan limits for the Fields of Mars MIR-UST and ANC-UST strategies
        if (deployConfig.mirFarmingStratContractAddress) {
            yield executeContract(terra, wallet, redBankContractAddress, {
                update_uncollateralized_loan_limit: {
                    user_address: deployConfig.mirFarmingStratContractAddress,
                    asset: {
                        native: {
                            denom: 'uusd',
                        },
                    },
                    // TODO should we do this in the production deploy? What initial limit should we give this strategy
                    new_limit: '1000000000000000', // one billion UST
                },
            });
            console.log(`Uncollateralized loan limit for contract ${deployConfig.mirFarmingStratContractAddress} (Fields MIR-UST):`, yield queryContract(terra, redBankContractAddress, {
                uncollateralized_loan_limit: {
                    user_address: deployConfig.mirFarmingStratContractAddress,
                    asset: { native: { denom: 'uusd' } },
                },
            }));
        }
        if (deployConfig.ancFarmingStratContractAddress) {
            yield executeContract(terra, wallet, redBankContractAddress, {
                update_uncollateralized_loan_limit: {
                    user_address: deployConfig.ancFarmingStratContractAddress,
                    asset: {
                        native: {
                            denom: 'uusd',
                        },
                    },
                    // TODO should we do this in the production deploy? What initial limit should we give this strategy
                    new_limit: '1000000000000000', // one billion UST
                },
            });
            console.log(`Uncollateralized loan limit for contract ${deployConfig.ancFarmingStratContractAddress} (Fields ANC-UST):`, yield queryContract(terra, redBankContractAddress, {
                uncollateralized_loan_limit: {
                    user_address: deployConfig.ancFarmingStratContractAddress,
                    asset: { native: { denom: 'uusd' } },
                },
            }));
        }
        if (deployConfig.marsFarmingStratContractAddress) {
            yield executeContract(terra, wallet, redBankContractAddress, {
                update_uncollateralized_loan_limit: {
                    user_address: deployConfig.marsFarmingStratContractAddress,
                    asset: {
                        native: {
                            denom: 'uusd',
                        },
                    },
                    // TODO should we do this in the production deploy? What initial limit should we give this strategy
                    new_limit: '1000000000000000', // one billion UST
                },
            });
            console.log(`Uncollateralized loan limit for contract ${deployConfig.marsFarmingStratContractAddress} (Fields ANC-UST):`, yield queryContract(terra, redBankContractAddress, {
                uncollateralized_loan_limit: {
                    user_address: deployConfig.marsFarmingStratContractAddress,
                    asset: { native: { denom: 'uusd' } },
                },
            }));
        }
        // Once initial assets initialized, set the owner of Red Bank to be Council rather than EOA
        console.log(`Updating Red Bank to be owned by Council contract ${councilContractAddress}`);
        deployConfig.redBankInitMsg.config.owner = councilContractAddress;
        yield executeContract(terra, wallet, redBankContractAddress, {
            update_config: deployConfig.redBankInitMsg,
        });
        console.log('Red Bank config successfully updated: ', yield queryContract(terra, redBankContractAddress, { config: {} }));
    });
}
main().catch(console.log);
