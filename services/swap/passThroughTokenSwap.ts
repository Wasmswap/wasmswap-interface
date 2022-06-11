import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
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
  swapAddress: string
  outputSwapAddress: string
  tokenA: TokenInfo
  client: SigningCosmWasmClient
}

export const passThroughTokenSwap = async ({
  tokenAmount,
  tokenA,
  outputSwapAddress,
  swapAddress,
  senderAddress,
  slippage,
  price,
  client,
}: PassThroughTokenSwapArgs): Promise<any> => {
  const minOutputToken = Math.floor(price * (1 - slippage))

  const swapMessage = {
    pass_through_swap: {
      output_min_token: `${minOutputToken}`,
      input_token: 'Token2',
      input_token_amount: `${tokenAmount}`,
      output_amm_address: outputSwapAddress,
    },
  }

  if (!tokenA.native) {
    const increaseAllowanceMessage = createIncreaseAllowanceMessage({
      senderAddress,
      tokenAmount,
      tokenAddress: tokenA.token_address,
      swapAddress,
    })

    const executeMessage = createExecuteMessage({
      senderAddress,
      contractAddress: swapAddress,
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
    swapAddress,
    swapMessage,
    'auto',
    undefined,
    [coin(tokenAmount, tokenA.denom)]
  )
}
