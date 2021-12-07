import {
  SigningCosmWasmClient,
  CosmWasmClient
} from '@cosmjs/cosmwasm-stargate'
//import { MsgExecuteContract } from '@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx'
import { toUtf8 } from '@cosmjs/encoding'
import { coin, StdFee } from '@cosmjs/launchpad'
import { BroadcastTxResponse } from '@cosmjs/stargate'

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
  const executeContractMsg1 = {
    
  }
  let msg2 = {
    add_liquidity: {
      max_token: `${input.maxToken}`,
      min_liquidity: `${input.minLiquidity}`,
    },
  }
  const executeContractMsg2 = {

  }
  const fee: StdFee = {
    amount: input.client.fees.exec.amount,
    gas: (Number(input.client.fees.exec.gas) * 2).toString(),
  }
  const executeAddLiquidity = await input.client.signAndBroadcast(
    input.senderAddress,
    [],
    fee
  )
  return executeAddLiquidity
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
  const execute = await input.client.execute(
    input.senderAddress,
    input.swapAddress,
    msg,
    undefined,
    ""
  )
  return execute
}

export type GetLiquidityBalanceInput = {
  address: string
  swapAddress: string
  rpcEndpoint: string
}

export const getLiquidityBalance = async ({
  rpcEndpoint,
  swapAddress,
  address,
}: GetLiquidityBalanceInput) => {
  try {
    const client = await CosmWasmClient.connect(rpcEndpoint)
    const query = await client.queryContractSmart(swapAddress, {
      balance: { address },
    })
    return query.balance
  } catch (e) {
    console.error('Cannot get liquidity balance:', e)
  }
}
