import {
  SigningCosmWasmClient,
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import { BroadcastTxResponse, StdFee, coin} from '@cosmjs/stargate'
import { defaultExecuteFee } from 'util/fees'

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
  const msg = {
    swap_native_for_token: {
      min_token: `${minToken}`,
    },
  }
  return await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    msg,
    defaultExecuteFee,
    undefined,
    [coin(input.nativeAmount, 'ujuno')]
  )
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

export const swapTokenForNative = async (
  input: swapTokenForNativeInput
): Promise<BroadcastTxResponse> => {
  const minNative = Math.floor(input.price * (1 - input.slippage))
  let msg1 = {
    increase_allowance: {
      amount: `${input.tokenAmount}`,
      spender: `${input.swapAddress}`,
    },
  }
  const executeContractMsg1: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: input.senderAddress,
      contract: input.tokenAddress,
      msg: toUtf8(JSON.stringify(msg1)),
      funds: [],
    }),
  }
  let msg2 = {
    swap_token_for_native: {
      min_native: `${minNative}`,
      token_amount: `${input.tokenAmount}`,
    },
  }
  const executeContractMsg2: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: input.senderAddress,
      contract: input.swapAddress,
      msg: toUtf8(JSON.stringify(msg2)),
      funds: [],
    }),
  }
  const fee: StdFee = {
    amount: defaultExecuteFee.amount,
    gas: (Number(defaultExecuteFee.gas) * 2).toString(),
  }
  return await input.client.signAndBroadcast(
    input.senderAddress,
    [executeContractMsg1, executeContractMsg2],
    fee
  )
}

export interface swapTokenForTokenInput {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  outputSwapAddress: string
  tokenAddress: string
  client: SigningCosmWasmClient
}

export const swapTokenForToken = async (
  input: swapTokenForTokenInput
): Promise<BroadcastTxResponse> => {
  const minOutputToken = Math.floor(input.price * (1 - input.slippage))
  let msg1 = {
    increase_allowance: {
      amount: `${input.tokenAmount}`,
      spender: `${input.swapAddress}`,
    },
  }
  const executeContractMsg1: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: input.senderAddress,
      contract: input.tokenAddress,
      msg: toUtf8(JSON.stringify(msg1)),
      funds: [],
    }),
  }
  let msg2 = {
    swap_token_for_token: {
      output_min_token: `${minOutputToken}`,
      input_token_amount: `${input.tokenAmount}`,
      output_amm_address: input.outputSwapAddress,
    },
  }
  const executeContractMsg2: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: input.senderAddress,
      contract: input.swapAddress,
      msg: toUtf8(JSON.stringify(msg2)),
      funds: [],
    }),
  }
  const fee: StdFee = {
    amount: defaultExecuteFee.amount,
    gas: (+defaultExecuteFee.gas * 3).toString(),
  }
  return await input.client.signAndBroadcast(
    input.senderAddress,
    [executeContractMsg1, executeContractMsg2],
    fee
  )
}

export interface getNativeForTokenPriceInput {
  nativeAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getNativeForTokenPrice = async (
  input: getNativeForTokenPriceInput
) => {
  try {
    const client = await CosmWasmClient.connect(input.rpcEndpoint)
    const query = await client.queryContractSmart(input.swapAddress, {
      native_for_token_price: {
        native_amount: `${input.nativeAmount}`,
      },
    })
    return query.token_amount
  } catch (e) {
    console.error(e)
  }
}

export interface getTokenForNativePriceInput {
  tokenAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getTokenForNativePrice = async (
  input: getTokenForNativePriceInput
) => {
  try {
    const client = await CosmWasmClient.connect(input.rpcEndpoint)
    const query = await client.queryContractSmart(input.swapAddress, {
      token_for_native_price: {
        token_amount: `${input.tokenAmount}`,
      },
    })
    return query.native_amount
  } catch (e) {
    console.error(e)
  }
}

export interface getTokenForTokenPriceInput {
  tokenAmount: number
  swapAddress: string
  outputSwapAddress: string
  rpcEndpoint: string
}

export const getTokenForTokenPrice = async (
  input: getTokenForTokenPriceInput
) => {
  try {
    const nativePrice = await getTokenForNativePrice({
      tokenAmount: input.tokenAmount,
      swapAddress: input.swapAddress,
      rpcEndpoint: input.rpcEndpoint,
    })

    return getNativeForTokenPrice({
      nativeAmount: nativePrice,
      swapAddress: input.outputSwapAddress,
      rpcEndpoint: input.rpcEndpoint,
    })
  } catch (e) {
    console.error(e)
  }
}

export type InfoResponse = {
  native_denom: string
  native_reserve: string
  token_address: string
  token_denom: string
  token_reserve: string
  lp_token_supply: string
}

export const getSwapInfo = async (
  swapAddress: string,
  rpcEndpoint: string
): Promise<InfoResponse> => {
  try {
    if (!swapAddress || !rpcEndpoint) {
      throw new Error(
        `No swapAddress or rpcEndpoint was provided: ${JSON.stringify({
          swapAddress,
          rpcEndpoint,
        })}`
      )
    }
    const client = await CosmWasmClient.connect(rpcEndpoint)
    return await client.queryContractSmart(swapAddress, {
      info: {},
    })
  } catch (e) {
    console.error('Cannot get swap info:', e)
  }
}
