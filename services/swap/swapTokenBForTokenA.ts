import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { TokenInfo } from '../../queries/usePoolsListQuery'
import { unsafelyGetDefaultExecuteFee } from '../../util/fees'
import { executeSwapWithIncreasedAllowance } from './executeSwapWithIncreasedAllowance'

export type SwapTokenBForTokenAArgs = {
  tokenAmount: number
  price: number
  slippage: number
  senderAddress: string
  swapAddress: string
  client: SigningCosmWasmClient
  tokenA: TokenInfo
}

export const swapTokenBForTokenA = async ({
  price,
  tokenA,
  tokenAmount,
  senderAddress,
  swapAddress,
  slippage,
  client,
}: SwapTokenBForTokenAArgs): Promise<any> => {
  const minNative = Math.floor(price * (1 - slippage))
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

  const swapMessage = {
    swap: {
      input_token: 'Token2',
      input_amount: `${tokenAmount}`,
      min_output: `${minNative}`,
    },
  }

  if (!tokenA.native) {
    return executeSwapWithIncreasedAllowance({
      tokenAddress: tokenA.token_address,
      tokenAmount,
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
    defaultExecuteFee,
    undefined,
    [{ amount: tokenAmount.toString(), denom: tokenA.denom }]
  )
}
