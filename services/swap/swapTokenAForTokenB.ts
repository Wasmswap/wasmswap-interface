import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import { unsafelyGetDefaultExecuteFee } from '../../util/fees'
import { executeSwapWithIncreasedAllowance } from './executeSwapWithIncreasedAllowance'

export type SwapToken1AForTokenBArgs = {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  client: SigningCosmWasmClient
}

export const swapTokenAForTokenB = async ({
  tokenA,
  tokenB,
  swapAddress,
  senderAddress,
  slippage,
  price,
  tokenAmount,
  client,
}: SwapToken1AForTokenBArgs) => {
  const minToken = Math.floor(price * (1 - slippage))
  const swapMessage = {
    swap: {
      input_token: 'Token1',
      input_amount: `${tokenAmount}`,
      min_output: `${minToken}`,
    },
  }

  if (!tokenB.native) {
    return executeSwapWithIncreasedAllowance({
      swapMessage,
      swapAddress,
      senderAddress,
      tokenAmount,
      tokenAddress: tokenB.token_address,
      client,
    })
  }

  return await client.execute(
    senderAddress,
    swapAddress,
    swapMessage,
    unsafelyGetDefaultExecuteFee(),
    undefined,
    [coin(tokenAmount, tokenA.denom)]
  )
}
