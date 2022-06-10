import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { coin } from '@cosmjs/stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import { executeSwapWithIncreasedAllowance } from './executeSwapWithIncreasedAllowance'

type SwapTokenAForTokenBArgs = {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  tokenA: TokenInfo
  client: SigningCosmWasmClient
}

export const swapTokenAForTokenB = async ({
  tokenA,
  swapAddress,
  senderAddress,
  slippage,
  price,
  tokenAmount,
  client,
}: SwapTokenAForTokenBArgs) => {
  const minToken = Math.floor(price * (1 - slippage))
  const swapMessage = {
    swap: {
      input_token: 'Token1',
      input_amount: `${tokenAmount}`,
      min_output: `${minToken}`,
    },
  }

  if (!tokenA.native) {
    return executeSwapWithIncreasedAllowance({
      swapMessage,
      swapAddress,
      senderAddress,
      tokenAmount,
      tokenAddress: tokenA.token_address,
      client,
    })
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
