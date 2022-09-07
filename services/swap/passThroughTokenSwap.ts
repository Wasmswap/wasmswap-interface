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
  inputPool: PoolEntityType
  outputPool: PoolEntityType
  tokenA: TokenInfo
  client: SigningCosmWasmClient
}

export const passThroughTokenSwap = async ({
  tokenAmount,
  tokenA,
  outputPool,
  inputPool,
  senderAddress,
  slippage,
  price,
  client,
}: PassThroughTokenSwapArgs): Promise<any> => {
  const minOutputToken = Math.floor(price * (1 - slippage))

  const input_token =
    inputPool.pool_assets[0].symbol === tokenA.symbol ? 'Token1' : 'Token2'

  const swapMessage = {
    pass_through_swap: {
      output_min_token: `${minOutputToken}`,
      input_token,
      input_token_amount: `${tokenAmount}`,
      output_amm_address: outputPool.swap_address,
    },
  }

  if (!tokenA.native) {
    const increaseAllowanceMessage = createIncreaseAllowanceMessage({
      senderAddress,
      tokenAmount,
      tokenAddress: tokenA.token_address,
      swapAddress: inputPool.swap_address,
    })

    const executeMessage = createExecuteMessage({
      senderAddress,
      contractAddress: inputPool.swap_address,
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
    inputPool.swap_address,
    swapMessage,
    'auto',
    undefined,
    [coin(tokenAmount, tokenA.denom)]
  )
}
