import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'

export const stakeTokens = async (
  senderAddress: string,
  tokenAddress: string,
  amount: number,
  client: SigningCosmWasmClient
) => {
  let msg = { stake: { amount: amount.toString() } }
  return await client.execute(
    senderAddress,
    tokenAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const unstakeTokens = async (
  senderAddress: string,
  tokenAddress: string,
  amount: number,
  client: SigningCosmWasmClient
) => {
  let msg = { unstake: { amount: amount.toString() } }
  return await client.execute(
    senderAddress,
    tokenAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const claimTokens = async (
  senderAddress: string,
  tokenAddress: string,
  client: SigningCosmWasmClient
) => {
  let msg = { claim: {} }
  return await client.execute(
    senderAddress,
    tokenAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    []
  )
}

export const getStakedBalance = async (
  address: string,
  tokenAddress: string,
  client: CosmWasmClient
): Promise<string> => {
  let msg = { staked_balance_at_height: { address: address } }
  let result = await client.queryContractSmart(tokenAddress, msg)
  return result.balance
}

export const getTotalStakedBalance = async (
  tokenAddress: string,
  client: CosmWasmClient
): Promise<string> => {
  let msg = { total_staked_at_height: {} }
  let result = await client.queryContractSmart(tokenAddress, msg)
  return result.total
}

export type claim = {
  amount: string
  release_at: number
}

export const getClaims = async (
  address: string,
  tokenAddress: string,
  client: CosmWasmClient
): Promise<Array<claim>> => {
  let msg = { claims: { address: address } }
  let resp = await client.queryContractSmart(tokenAddress, msg)
  return resp.claims.map((c) => {
    return {
      amount: c.amount,
      release_at: c.release_at.at_time,
    }
  })
}

export const getUnstakingDuration = async (
  tokenAddress: string,
  client: CosmWasmClient
): Promise<number> => {
  let msg = { unstaking_duration: {} }
  let result = await client.queryContractSmart(tokenAddress, msg)
  return result.duration.time
}
