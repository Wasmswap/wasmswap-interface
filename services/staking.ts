import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toBase64, toUtf8 } from '@cosmjs/encoding'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'
import { StdFee } from '@cosmjs/stargate'

export const stakeTokens = async (
  senderAddress: string,
  stakeContractAddress: string,
  lpTokenAddress: string,
  amount: number,
  client: SigningCosmWasmClient
) => {
  const subMsg = { stake: {} }
  const encodedMsg = toBase64(toUtf8(JSON.stringify(subMsg)))
  const msg = {
    send: {
      contract: stakeContractAddress,
      amount: String(amount),
      msg: encodedMsg,
    },
  }

  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()
  const fee: StdFee = {
    amount: defaultExecuteFee.amount,
    gas: (Number(defaultExecuteFee.gas) * 2.6).toString(),
  }

  return await client.execute(
    senderAddress,
    lpTokenAddress,
    msg,
    fee,
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
  const msg = { unstake: { amount: amount.toString() } }
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
  const msg = { claim: {} }
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
  const msg = { staked_balance_at_height: { address: address } }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.balance
}

export const getTotalStakedBalance = async (
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<string> => {
  const msg = { total_staked_at_height: {} }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.total
}

export type Claim = {
  amount: number
  release_at: number
}

export const getClaims = async (
  address: string,
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<Array<Claim>> => {
  const msg = { claims: { address: address } }
  const resp = await client.queryContractSmart(stakingContractAddress, msg)

  return resp.claims.map((c) => {
    return {
      amount: Number(c.amount),
      release_at: Number(c.release_at.at_time) / 1000000,
    }
  })
}

export const getUnstakingDuration = async (
  stakingContractAddress: string,
  client: CosmWasmClient
): Promise<number> => {
  const msg = { unstaking_duration: {} }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.duration.time
}
