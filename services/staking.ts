import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'

export const stakeTokens = async (
  senderAddress: string,
  stakeContractAddress: string,
  lpTokenAddress: string,
  amount: number,
  client: SigningCosmWasmClient
) => {
  let subMsg = { stake: {} }
  let encodedMsg = toBase64(toUtf8(JSON.stringify(subMsg)))
  console.log(encodedMsg)
  let msg = {
    send: {
      contract: stakeContractAddress,
      amount: amount.toString(),
      msg: encodedMsg,
    },
  }
  return await client.execute(
    senderAddress,
    lpTokenAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const unstakeTokens = async (
  senderAddress: string,
  stakingContractAddress: string,
  amount: number,
  client: SigningCosmWasmClient
) => {
  let msg = { unstake: { amount: amount.toString() } }
  return await client.execute(
    senderAddress,
    stakingContractAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const claimTokens = async (
  senderAddress: string,
  stakingContractAddress: string,
  client: SigningCosmWasmClient
) => {
  let msg = { claim: {} }
  return await client.execute(
    senderAddress,
    stakingContractAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const getStakedBalance = async (
  address: string,
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<string> => {
  let msg = { staked_balance_at_height: { address: address } }
  let result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.balance
}

export const getTotalStakedBalance = async (
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<string> => {
  let msg = { total_staked_at_height: {} }
  let result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.total
}

export type claim = {
  amount: string
  release_at: number
}

export const getClaims = async (
  address: string,
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<Array<claim>> => {
  let msg = { claims: { address: address } }
  let resp = await client.queryContractSmart(stakingContractAddress, msg)
  return resp.claims.map((c) => {
    return {
      amount: c.amount,
      release_at: c.release_at.at_time,
    }
  })
}

export const getUnstakingDuration = async (
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<number> => {
  let msg = { unstaking_duration: {} }
  let result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.duration.time
}
