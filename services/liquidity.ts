import {
  CosmWasmClient,
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { toUtf8 } from '@cosmjs/encoding'
import { coin, isDeliverTxFailure, StdFee } from '@cosmjs/stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { protectAgainstNaN } from 'junoblocks'

import { TokenInfo } from '../queries/usePoolsListQuery'
import { unsafelyGetDefaultExecuteFee } from '../util/fees'

export type AddLiquidityInput = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  tokenAAmount: number
  tokenBAmount: number
  senderAddress: string
  swapAddress: string
  client: SigningCosmWasmClient
}

export const addLiquidity = async ({
  tokenA,
  tokenB,
  tokenAAmount,
  tokenBAmount,
  client,
  swapAddress,
  senderAddress,
}: AddLiquidityInput): Promise<any> => {
  const addLiquidityMessage = {
    add_liquidity: {
      token1_amount: `${tokenAAmount}`,
      max_token2: `${tokenBAmount}`,
      min_liquidity: `${0}`,
    },
  }

  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

  if (!tokenA.native || !tokenB.native) {
    const increaseAllowanceMessages: Array<MsgExecuteContractEncodeObject> = []
    const addIncreaseAllowanceMessage = ({ tokenAmount, tokenAddress }) => {
      increaseAllowanceMessages.push({
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: senderAddress,
          contract: tokenAddress,
          msg: toUtf8(
            JSON.stringify({
              increase_allowance: {
                amount: `${tokenAmount}`,
                spender: `${swapAddress}`,
              },
            })
          ),
          funds: [],
        }),
      })
    }
    /* increase allowance for each non-native token */
    if (!tokenA.native) {
      addIncreaseAllowanceMessage({
        tokenAmount: tokenAAmount,
        tokenAddress: tokenA.token_address,
      })
    }
    if (!tokenB.native) {
      addIncreaseAllowanceMessage({
        tokenAmount: tokenBAmount,
        tokenAddress: tokenB.token_address,
      })
    }

    const executeAddLiquidityMessage: MsgExecuteContractEncodeObject = {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: senderAddress,
        contract: swapAddress,
        msg: toUtf8(JSON.stringify(addLiquidityMessage)),
        funds: [],
      }),
    }

    /* each native token needs to be added to the funds */
    if (tokenA.native) {
      executeAddLiquidityMessage.value.funds.push(
        coin(tokenAAmount, tokenA.denom)
      )
    }
    if (tokenB.native) {
      executeAddLiquidityMessage.value.funds.push(
        coin(tokenBAmount, tokenB.denom)
      )
    }

    const fee: StdFee = {
      amount: defaultExecuteFee.amount,
      gas: (Number(defaultExecuteFee.gas) * 1.8).toString(),
    }

    const result = await client.signAndBroadcast(
      senderAddress,
      [...increaseAllowanceMessages, executeAddLiquidityMessage],
      fee
    )

    if (isDeliverTxFailure(result)) {
      throw new Error(
        `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
      )
    }

    return result
  } else {
    const funds = [
      coin(tokenAAmount, tokenA.denom),
      coin(tokenBAmount, tokenB.denom),
    ].sort((a, b) => (a.denom > b.denom ? 1 : -1))

    return await client.execute(
      senderAddress,
      swapAddress,
      addLiquidityMessage,
      defaultExecuteFee,
      undefined,
      funds
    )
  }
}

type RemoveLiquidityArgs = {
  tokenAmount: number
  senderAddress: string
  swapAddress: string
  lpTokenAddress: string
  client: SigningCosmWasmClient
}

export const removeLiquidity = async ({
  tokenAmount,
  swapAddress,
  senderAddress,
  lpTokenAddress,
  client,
}: RemoveLiquidityArgs) => {
  const removeLiquidityMessage = {
    remove_liquidity: {
      amount: `${tokenAmount}`,
      min_token1: `${0}`,
      min_token2: `${0}`,
    },
  }

  const increaseAllowanceMessage = {
    increase_allowance: {
      amount: `${tokenAmount}`,
      spender: `${swapAddress}`,
    },
  }

  const executeContractIncreaseAllowance: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: senderAddress,
      contract: lpTokenAddress,
      msg: toUtf8(JSON.stringify(increaseAllowanceMessage)),
      funds: [],
    }),
  }

  const executeContractMsg2: MsgExecuteContractEncodeObject = {
    typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
    value: MsgExecuteContract.fromPartial({
      sender: senderAddress,
      contract: swapAddress,
      msg: toUtf8(JSON.stringify(removeLiquidityMessage)),
      funds: [],
    }),
  }
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()
  const fee: StdFee = {
    amount: defaultExecuteFee.amount,
    gas: (Number(defaultExecuteFee.gas) * 2).toString(),
  }
  const result = await client.signAndBroadcast(
    senderAddress,
    [executeContractIncreaseAllowance, executeContractMsg2],
    fee
  )
  if (isDeliverTxFailure(result)) {
    throw new Error(
      `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
    )
  }
  return result
}

export type GetLiquidityBalanceInput = {
  address: string
  tokenAddress: string
  client: CosmWasmClient
}

export const getLiquidityBalance = async ({
  client,
  tokenAddress,
  address,
}: GetLiquidityBalanceInput) => {
  try {
    const query = await client.queryContractSmart(tokenAddress, {
      balance: { address },
    })

    return protectAgainstNaN(Number(query.balance))
  } catch (e) {
    console.error('Cannot get liquidity balance:', e)
  }
}
