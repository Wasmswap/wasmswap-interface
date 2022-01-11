import {
  SigningCosmWasmClient,
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import { StdFee, coin, isDeliverTxFailure } from '@cosmjs/stargate'
import { unsafelyGetBaseToken } from 'hooks/useTokenInfo'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'

export interface swapToken1ForToken2Input {
  nativeAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  client: SigningCosmWasmClient
}

export const swapToken1ForToken2 = async (input: swapToken1ForToken2Input) => {
  const minToken = Math.floor(input.price * (1 - input.slippage))
  const msg = {
    swap: {
      input_token: 'Token1',
      input_amount: `${input.nativeAmount}`,
      min_output: `${minToken}`,
    },
  }
  return await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    msg,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    [coin(input.nativeAmount, unsafelyGetBaseToken().denom)]
  )
}

export interface swapToken2ForToken1Input {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  tokenAddress: string
  tokenDenom: string
  token2_native: boolean
  client: SigningCosmWasmClient
}

export const swapToken2ForToken1 = async (
  input: swapToken2ForToken1Input
): Promise<any> => {
  const minNative = Math.floor(input.price * (1 - input.slippage))
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

  let swap_msg = {
    swap: {
      input_token: 'Token2',
      input_amount: `${input.tokenAmount}`,
      min_output: `${minNative}`,
    },
  }

  if (!input.token2_native) {
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

    const executeContractMsg2: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.swapAddress,
        msg: toUtf8(JSON.stringify(swap_msg)),
        funds: [],
      }),
    }
    const fee: StdFee = {
      amount: defaultExecuteFee.amount,
      gas: (Number(defaultExecuteFee.gas) * 1.2).toString(),
    }
    let result = await input.client.signAndBroadcast(
      input.senderAddress,
      [executeContractMsg1, executeContractMsg2],
      fee
    )
    if (isDeliverTxFailure(result)) {
      throw new Error(
        `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
      )
    }
    return result
  } else {
    return await input.client.execute(
      input.senderAddress,
      input.swapAddress,
      swap_msg,
      defaultExecuteFee,
      undefined,
      [{ amount: input.tokenAmount.toString(), denom: input.tokenDenom }]
    )
  }
}

export interface swapTokenForTokenInput {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  outputSwapAddress: string
  tokenAddress: string
  tokenDenom: string
  tokenNative: boolean
  client: SigningCosmWasmClient
}

export const swapTokenForToken = async (
  input: swapTokenForTokenInput
): Promise<any> => {
  const minOutputToken = Math.floor(input.price * (1 - input.slippage))
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

  const swapMsg = {
    pass_through_swap: {
      output_min_token: `${minOutputToken}`,
      input_token: 'Token2',
      input_token_amount: `${input.tokenAmount}`,
      output_amm_address: input.outputSwapAddress,
    },
  }
  if (!input.tokenNative) {
    const msg1 = {
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

    const executeContractMsg2: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: input.senderAddress,
        contract: input.swapAddress,
        msg: toUtf8(JSON.stringify(swapMsg)),
        funds: [],
      }),
    }
    const fee: StdFee = {
      amount: defaultExecuteFee.amount,
      gas: (+defaultExecuteFee.gas * 2).toString(),
    }
    let result = await input.client.signAndBroadcast(
      input.senderAddress,
      [executeContractMsg1, executeContractMsg2],
      fee
    )
    if (isDeliverTxFailure(result)) {
      throw new Error(
        `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
      )
    }
    return result
  }
  return await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    swapMsg,
    {
      amount: defaultExecuteFee.amount,
      gas: (+defaultExecuteFee.gas * 2).toString(),
    },
    undefined,
    [{ amount: input.tokenAmount.toString(), denom: input.tokenDenom }]
  )
}

export interface getToken1ForToken2PriceInput {
  nativeAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getToken1ForToken2Price = async (
  input: getToken1ForToken2PriceInput
) => {
  try {
    const client = await CosmWasmClient.connect(input.rpcEndpoint)
    const query = await client.queryContractSmart(input.swapAddress, {
      token1_for_token2_price: {
        token1_amount: `${input.nativeAmount}`,
      },
    })
    return query.token2_amount
  } catch (e) {
    console.error('err(getToken1ForToken2Price):', e)
  }
}

export interface getToken2ForToken1PriceInput {
  tokenAmount: number
  swapAddress: string
  rpcEndpoint: string
}

export const getToken2ForToken1Price = async (
  input: getToken2ForToken1PriceInput
) => {
  try {
    const client = await CosmWasmClient.connect(input.rpcEndpoint)
    const query = await client.queryContractSmart(input.swapAddress, {
      token2_for_token1_price: {
        token2_amount: `${input.tokenAmount}`,
      },
    })
    return query.token1_amount
  } catch (e) {
    console.error('error(getToken2ForToken1Price):', e)
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
    const nativePrice = await getToken2ForToken1Price({
      tokenAmount: input.tokenAmount,
      swapAddress: input.swapAddress,
      rpcEndpoint: input.rpcEndpoint,
    })

    return getToken1ForToken2Price({
      nativeAmount: nativePrice,
      swapAddress: input.outputSwapAddress,
      rpcEndpoint: input.rpcEndpoint,
    })
  } catch (e) {
    console.error('error(getTokenForTokenPrice)', e)
  }
}
export type InfoResponse = {
  lp_token_supply: string
  lp_token_address: string
  token1_denom: string
  token1_reserve: string
  token2_denom: string
  token2_reserve: string
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
