import {
  SigningCosmWasmClient,
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import { BroadcastTxResponse, coin, StdFee } from '@cosmjs/stargate'
import { defaultExecuteFee } from 'util/fees'

export type AddLiquidityInput = {
  nativeAmount: number
  nativeDenom: string
  maxToken: number
  minLiquidity: number
  senderAddress: string
  swapAddress: string
  tokenAddress: string
  client: SigningCosmWasmClient
}

export const addLiquidity = async (
  input: AddLiquidityInput
): Promise<BroadcastTxResponse> => {
  let msg1 = {
    increase_allowance: {
      amount: `${input.maxToken}`,
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
    add_liquidity: {
      max_token: `${input.maxToken}`,
      min_liquidity: `${input.minLiquidity}`,
    },
  }
  const executeContractMsg2: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: input.senderAddress,
      contract: input.swapAddress,
      msg: toUtf8(JSON.stringify(msg2)),
      funds: [coin(input.nativeAmount, input.nativeDenom)],
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

export type RemoveLiquidityInput = {
  amount: number
  minNative: number
  minToken: number
  senderAddress: string
  swapAddress: string
  tokenAddress: string
  client: SigningCosmWasmClient
}

export const removeLiquidity = async (input: RemoveLiquidityInput) => {
  const msg = {
    remove_liquidity: {
      amount: `${input.amount}`,
      min_native: `${input.minNative}`,
      min_token: `${input.minToken}`,
    },
  }
  return await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    msg,
    defaultExecuteFee,
    undefined,
    []
  )
}

export type GetLiquidityBalanceInput = {
  address: string
  tokenAddress: string
  rpcEndpoint: string
}

export const getLiquidityBalance = async ({
  rpcEndpoint,
  tokenAddress,
  address,
}: GetLiquidityBalanceInput) => {
  try {
    const client = await CosmWasmClient.connect(rpcEndpoint)
    const query = await client.queryContractSmart(tokenAddress, {
      balance: { address },
    })
    console.log({
      query,
    })
    return query.balance
  } catch (e) {
    console.error('Cannot get liquidity balance:', e)
  }
}
