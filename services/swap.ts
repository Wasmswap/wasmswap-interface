import {
  SigningCosmWasmClient,
  CosmWasmClient,
  MsgExecuteContractEncodeObject
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from '@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import { coin, StdFee } from '@cosmjs/launchpad'
import { BroadcastTxResponse } from '@cosmjs/stargate'

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

export const swapTokenForNative = async (input: swapTokenForNativeInput) : Promise<BroadcastTxResponse> => {

  const minNative = Math.floor(input.price * (1 - input.slippage))
  let msg1 = {
    increase_allowance: {
      amount: `${input.tokenAmount}`,
      spender: `${input.swapAddress}`,
    }, 
  }
  const executeContractMsg1:MsgExecuteContractEncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.tokenAddress,
        msg: toUtf8(JSON.stringify(msg1)),
        funds: [],
    }),
  };
  let msg2 = {
    swap_token_for_native: {
      min_native: `${minNative}`,
      token_amount: `${input.tokenAmount}`,
    },
  }
  const executeContractMsg2:MsgExecuteContractEncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.swapAddress,
        msg: toUtf8(JSON.stringify(msg2)),
        funds: [],
    }),
  };
  const fee: StdFee = {amount:input.client.fees.exec.amount,gas:(+input.client.fees.exec.gas*2).toString()}
  const executeSwap = await input.client.signAndBroadcast(input.senderAddress,[executeContractMsg1, executeContractMsg2], fee)
  console.log(executeSwap)
  return executeSwap
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

export const swapTokenForToken = async (input: swapTokenForTokenInput) : Promise<BroadcastTxResponse> => {

  const minOutputToken = Math.floor(input.price * (1 - input.slippage))
  let msg1 = {
    increase_allowance: {
      amount: `${input.tokenAmount}`,
      spender: `${input.swapAddress}`,
    }, 
  }
  const executeContractMsg1:MsgExecuteContractEncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.tokenAddress,
        msg: toUtf8(JSON.stringify(msg1)),
        funds: [],
    }),
  };
  let msg2 = {
    swap_token_for_token: {
      output_min_token: `${minOutputToken}`,
      input_token_amount: `${input.tokenAmount}`,
      output_amm_address: input.outputSwapAddress
    },
  }
  const executeContractMsg2:MsgExecuteContractEncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
    value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.swapAddress,
        msg: toUtf8(JSON.stringify(msg2)),
        funds: [],
    }),
  };
  const fee: StdFee = {amount:input.client.fees.exec.amount,gas:(+input.client.fees.exec.gas*3).toString()}
  const executeSwap = await input.client.signAndBroadcast(input.senderAddress,[executeContractMsg1, executeContractMsg2], fee)
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
  try{
  console.log(input)
  const client = await CosmWasmClient.connect(input.rpcEndpoint)
  const query = await client.queryContractSmart(input.swapAddress, {
    native_for_token_price: {
      native_amount: `${input.nativeAmount}`,
    },
  })
  console.log(query)
  return query.token_amount
  } catch(e) {
    console.log(e)
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
  try{
  const client = await CosmWasmClient.connect(input.rpcEndpoint)
  const query = await client.queryContractSmart(input.swapAddress, {
    token_for_native_price: {
      token_amount: `${input.tokenAmount}`,
    },
  })
  console.log(query)
  return query.native_amount
}catch(e){
  console.log(e)
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
  try{
    const nativePrice = await getTokenForNativePrice({
      tokenAmount: input.tokenAmount,
      swapAddress: input.swapAddress,
      rpcEndpoint: input.rpcEndpoint
    })

    return getNativeForTokenPrice({
      nativeAmount: nativePrice,
      swapAddress: input.outputSwapAddress,
      rpcEndpoint: input.rpcEndpoint
    })
  } catch(e){
    console.log(e)
  }
}

export type InfoResponse = {
  native_denom: string
  native_reserve: string
  token_address: string
  token_denom: string
  token_reserve: string
}

export const getSwapInfo = async(swapAddress: string, rpcEndpoint: string): Promise<InfoResponse> => {
  try{
    const client = await CosmWasmClient.connect(rpcEndpoint)
    return await client.queryContractSmart(swapAddress, {
      get_info: {},
    })
  }catch(e){
    console.log(e)
  }
}
