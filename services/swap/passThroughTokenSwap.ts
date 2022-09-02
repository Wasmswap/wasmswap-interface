import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { PoolEntityType, TokenInfo } from '../../queries/usePoolsListQuery'
import {
  createExecuteMessage,
  createIncreaseAllowanceMessage,
  validateTransactionSuccess,
} from '../../util/messages'

type PassThroughTokenSwapArgs = {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swap: PoolEntityType
  outputSwap: PoolEntityType
  tokenA: TokenInfo
  client: SigningCosmWasmClient
}

export const passThroughTokenSwap = async ({
  tokenAmount,
  tokenA,
  outputSwap,
  swap,
  senderAddress,
  slippage,
  price,
  client,
}: PassThroughTokenSwapArgs): Promise<any> => {
  const minOutputToken = Math.floor(price * (1 - slippage))

  const input_token =
    swap.pool_assets[0].symbol === tokenA.symbol ? 'Token1' : 'Token2'

  const swapMessage = {
    pass_through_swap: {
      output_min_token: `${minOutputToken}`,
      input_token,
      input_token_amount: `${tokenAmount}`,
      output_amm_address: outputSwap.swap_address,
    },
  }

  if (!tokenA.native) {
    const increaseAllowanceMessage = createIncreaseAllowanceMessage({
      senderAddress,
      tokenAmount,
      tokenAddress: tokenA.token_address,
      swapAddress: swap.swap_address,
    })

    const executeMessage = createExecuteMessage({
      senderAddress,
      contractAddress: swap.swap_address,
      message: swapMessage,
    })

    return validateTransactionSuccess(
      await client.signAndBroadcast(
        senderAddress,
        [increaseAllowanceMessage, executeMessage],
        'auto'
      )
    )
  }

  return await client.execute(
    senderAddress,
    swap.swap_address,
    swapMessage,
    'auto',
    undefined,
    [coin(tokenAmount, tokenA.denom)]
  )
}
