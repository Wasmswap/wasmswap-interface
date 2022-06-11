import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'

import {
  createExecuteMessage,
  validateTransactionSuccess,
} from '../util/messages'

type Denom =
  | {
      native: string
    }
  | {
      /* cw20 token_address */
      cw20: string
    }

export const claimRewards = async (
  senderAddress: string,
  rewardsAddresses: Array<string>,
  client: SigningCosmWasmClient
) => {
  const claimRewardsMsg = { claim: {} }

  const messages = rewardsAddresses.map((rewardsAddress) =>
    createExecuteMessage({
      senderAddress,
      contractAddress: rewardsAddress,
      message: claimRewardsMsg,
    })
  )

  return validateTransactionSuccess(
    await client.signAndBroadcast(senderAddress, messages, 'auto')
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

export type RewardsInfoResponse = {
  config: {
    owner?: string
    manager?: string
    staking_contract: string
    reward_token: Denom
  }
  reward: {
    period_finish: number
    reward_rate: number
    reward_duration: number
  }
}

export const getRewardsInfo = async (
  rewardsAddress: string,
  client: CosmWasmClient
): Promise<RewardsInfoResponse> => {
  const msg = { info: {} }
  return await client.queryContractSmart(rewardsAddress, msg)
}
