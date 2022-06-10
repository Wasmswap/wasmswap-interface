import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toBase64, toUtf8 } from '@cosmjs/encoding'

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

  return await client.execute(
    senderAddress,
    lpTokenAddress,
    msg,
    'auto',
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
  amount = Math.floor(amount)
  const msg = { unstake: { amount: amount.toString() } }

  return await client.execute(
    senderAddress,
    stakingContractAddress,
    msg,
    'auto',
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
    'auto',
    undefined,
    []
  )
}

export const getProvidedStakedAmount = async (
  address: string,
  stakingContractAddress: string,
  client: CosmWasmClient
) => {
  const msg = { staked_value: { address: address } }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return Number(result.value)
}

export const getTotalStakedAmount = async (
  stakingContractAddress: string,
  client: CosmWasmClient
) => {
  const msg = { total_value: {} }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return Number(result.total)
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
  const msg = { get_config: {} }
  const result = await client.queryContractSmart(stakingContractAddress, msg)
  return result.unstaking_duration.time
}
