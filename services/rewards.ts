import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'

export const claimRewards = async (
  senderAddress: string,
  rewardsAddress: string,
  client: SigningCosmWasmClient
) => {
  let msg = { stake: { claim: {} } }
  return await client.execute(
    senderAddress,
    rewardsAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const getClaimableRewards = async (
  address: string,
  rewardsAddress: string,
  client: CosmWasmClient
) => {
  let msg = { claimable_rewards: { address: address } }
  return (await client.queryContractSmart(rewardsAddress, msg)).amount
}

export type rewardsInfoResponse = {
  start_block: number
  end_block: number
  payment_per_block: string
  payment_time: number
  total_amount: string
  denom: string
  distribution_token: String
}

export const getRewardsInfo = async (
  rewardsAddress: string,
  client: CosmWasmClient
): Promise<rewardsInfoResponse> => {
  let msg = { info: {} }
  return (await client.queryContractSmart(rewardsAddress, msg)).amount
}
