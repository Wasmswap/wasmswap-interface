import {
  MsgExecuteContractEncodeObject,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { coin, isDeliverTxFailure, StdFee } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import { unsafelyGetDefaultExecuteFee } from '../../util/fees'
import { createExecuteMessage } from './utils/createExecuteMessage'
import { createIncreaseAllowanceMessage } from './utils/createIncreaseAllowanceMessage'

type ExecuteAddLiquidityArgs = {
  tokenA: TokenInfo
  tokenB: TokenInfo
  tokenAAmount: number
  /*
   * The contract calculates `tokenBAmount` automatically.
   * However, the user needs to set max amount of `tokenB` they're willing to spend.
   * If the calculated amount exceeds the max amount, the transaction then fails.
   */
  maxTokenBAmount: number
  senderAddress: string
  swapAddress: string
  client: SigningCosmWasmClient
}

export const executeAddLiquidity = async ({
  tokenA,
  tokenB,
  tokenAAmount,
  maxTokenBAmount,
  client,
  swapAddress,
  senderAddress,
}: ExecuteAddLiquidityArgs): Promise<any> => {
  const addLiquidityMessage = {
    add_liquidity: {
      token1_amount: `${tokenAAmount}`,
      max_token2: `${maxTokenBAmount}`,
      min_liquidity: `${0}`,
    },
  }

  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

  if (!tokenA.native || !tokenB.native) {
    const increaseAllowanceMessages: Array<MsgExecuteContractEncodeObject> = []

    /* increase allowance for each non-native token */
    if (!tokenA.native) {
      increaseAllowanceMessages.push(
        createIncreaseAllowanceMessage({
          tokenAmount: tokenAAmount,
          tokenAddress: tokenA.token_address,
          senderAddress,
          swapAddress,
        })
      )
    }
    if (!tokenB.native) {
      increaseAllowanceMessages.push(
        createIncreaseAllowanceMessage({
          tokenAmount: maxTokenBAmount,
          tokenAddress: tokenB.token_address,
          senderAddress,
          swapAddress,
        })
      )
    }

    const executeAddLiquidityMessage = createExecuteMessage({
      message: addLiquidityMessage,
      senderAddress,
      swapAddress,
      /* each native token needs to be added to the funds */
      funds: [
        tokenA.native && coin(tokenAAmount, tokenA.denom),
        tokenB.native && coin(maxTokenBAmount, tokenB.denom),
      ].filter(Boolean),
    })

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
  }

  const funds = [
    coin(tokenAAmount, tokenA.denom),
    coin(maxTokenBAmount, tokenB.denom),
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
