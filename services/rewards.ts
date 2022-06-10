import {
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { isDeliverTxFailure } from '@cosmjs/stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'

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
  const messageBody = toUtf8(JSON.stringify({ claim: {} }))

  const messages = rewardsAddresses.map(
    (rewardsAddress): MsgExecuteContractEncodeObject => ({
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: rewardsAddress,
        msg: messageBody,
        funds: [],
      }),
    })
  )

  const result = await client.signAndBroadcast(senderAddress, messages, 'auto')

  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
    )
  }

  return result
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
