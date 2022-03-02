import {
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { unsafelyGetDefaultExecuteFee } from 'util/fees'
import { toUtf8 } from '@cosmjs/encoding'
import { isDeliverTxFailure, StdFee } from '@cosmjs/stargate'

type Denom =
  | {
      native: string
    }
  | {
      cw20: string
    }

export const claimRewards = async (
  senderAddress: string,
  rewardsAddresses: Array<string>,
  client: SigningCosmWasmClient
) => {
  const messageBody = { claim: {} }

  const messages = rewardsAddresses.map(
    (rewardsAddress): MsgExecuteContractEncodeObject => ({
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: rewardsAddress,
        msg: toUtf8(JSON.stringify(messageBody)),
        funds: [],
      }),
    })
  )

  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()
  const fee: StdFee = {
    amount: defaultExecuteFee.amount,
    gas: String(Number(defaultExecuteFee.gas) * 2),
  }

  const result = await client.signAndBroadcast(senderAddress, messages, fee)

  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
    )
  }
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
