import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { unsafelyGetDefaultExecuteFee } from 'util/fees'

type Denom =
  | {
      native: string
    }
  | {
      cw20: string
    }

export const claimRewards = async (
  senderAddress: string,
  rewardsAddress: string,
  client: SigningCosmWasmClient
) => {
  const msg = { stake: { claim: {} } }
  return await client.execute(
    senderAddress,
    rewardsAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

type PendingRewardsResponse = {
  address: string
  pending_rewards: number
  denom: Denom
}

export const getPendingRewards = async (
  address: string,
  rewardsAddress: string,
  client: CosmWasmClient
): Promise<PendingRewardsResponse> => {
  const msg = { get_pending_rewards: { address } }
  return await client.queryContractSmart(rewardsAddress, msg)
}

type RewardsInfoResponse = {
  config: {
    owner?: string
    manager?: string
    staking_contract: string
    reward_token: Denom
  }
  reward_config: {
    periodFinish: number
    rewardRate: number
    rewardDuration: number
  }
}

export const getRewardsInfo = async (
  rewardsAddress: string,
  client: CosmWasmClient
): Promise<RewardsInfoResponse> => {
  const msg = { info: {} }
  return await client.queryContractSmart(rewardsAddress, msg)
}
