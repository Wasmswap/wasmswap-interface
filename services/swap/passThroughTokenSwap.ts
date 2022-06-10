import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import { executeSwapWithIncreasedAllowance } from './executeSwapWithIncreasedAllowance'

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
    return executeSwapWithIncreasedAllowance({
      tokenAmount,
      tokenAddress: tokenA.token_address,
      senderAddress,
      swapAddress,
      swapMessage,
      client,
    })
  }

  return await client.execute(
    senderAddress,
    swapAddress,
    swapMessage,
    'auto',
    undefined,
    [{ amount: tokenAmount.toString(), denom: tokenA.denom }]
  )
}
