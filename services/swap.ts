import {
  SigningCosmWasmClient,
  CosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/launchpad'

export interface swapNativeForTokenInput {
  nativeAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  client: SigningCosmWasmClient
}

export const swapNativeForToken = async (input: swapNativeForTokenInput) => {
  const minToken = Math.floor(input.price * (1 - input.slippage))
  console.log({ minToken })
  const msg = {
    swap_native_for_token: {
      min_token: `${minToken}`,
    },
  }
  console.log({ msg })
  const execute = await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    msg,
    undefined,
    [coin(input.nativeAmount, 'ujuno')]
  )
  console.log({ execute })

  return execute
}

export interface swapTokenForNativeInput {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  tokenAddress: string
  client: SigningCosmWasmClient
}

export const swapTokenForNative = async (input: swapTokenForNativeInput) => {
  // TODO can these call be done in one transaction

  const executeAllowance = await input.client.execute(
    input.senderAddress,
    input.tokenAddress,
    {
      increase_allowance: {
        amount: `${input.tokenAmount}`,
        spender: `${input.swapAddress}`,
      },
    }
  )
  console.log(executeAllowance)

  const minNative = Math.floor(input.price * (1 - input.slippage))
  const executeSwap = await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    {
      swap_token_for_native: {
        min_native: `${minNative}`,
        token_amount: `${input.tokenAmount}`,
      },
    }
  )
  console.log(executeSwap)

  return executeSwap
}

export interface getNativeForTokenPriceInput {
  nativeAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getNativeForTokenPrice = async (
  input: getNativeForTokenPriceInput
) => {
  console.log(input)
  const client = await CosmWasmClient.connect(input.rpcEndpoint)
  const query = await client.queryContractSmart(input.swapAddress, {
    native_for_token_price: {
      native_amount: `${input.nativeAmount}`,
    },
  })
  console.log(query)

  return query.token_amount
}

export interface getTokenForNativePriceInput {
  tokenAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getTokenForNativePrice = async (
  input: getTokenForNativePriceInput
) => {
  const client = await CosmWasmClient.connect(input.rpcEndpoint)
  const query = await client.queryContractSmart(input.swapAddress, {
    token_for_native_price: {
      token_amount: `${input.tokenAmount}`,
    },
  })
  console.log(query)

  return query.native_amount
}
