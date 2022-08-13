import { SwapInfo, useSwapInfo } from 'hooks/useSwapInfo'
import { useMemo } from 'react'
import { calcPoolTokenValue } from 'util/conversion'

import {
  TokenInfo,
  usePoolFromListQueryById,
} from '../../../queries/usePoolsListQuery'

type UsePoolPairTokenAmountArgs = {
  poolId: string
  tokenSymbol: TokenInfo['symbol']
  poolTokenAmountInMicroDenom: number
}

/*
 * `usePoolTokenToTokenAssetAmount` is used to calculate the amount of token asset
 * based on lp token amount provided
 * */
export const usePoolTokenToTokenAssetAmount = ({
  poolId,
  tokenSymbol,
  poolTokenAmountInMicroDenom,
}: UsePoolPairTokenAmountArgs) => {
  const [swapInfo, isLoading] = useSwapInfo({ poolId })
  const [pool] = usePoolFromListQueryById({ poolId })

  const tokenAssetIndex = useMemo(
    () =>
      pool?.pool_assets.findIndex(
        (tokenAsset) => tokenAsset.symbol === tokenSymbol
      ),
    [pool?.pool_assets, tokenSymbol]
  )

  const tokenReserves: SwapInfo['token1_reserve'] | SwapInfo['token2_reserve'] =
    swapInfo?.[`token${tokenAssetIndex + 1}_reserve`] ?? 0

  const amount = tokenReserves
    ? calcPoolTokenValue({
        tokenAmountInMicroDenom: poolTokenAmountInMicroDenom,
        tokenSupply: swapInfo.lp_token_supply,
        tokenReserves,
      })
    : 0

  if (
    process.env.NODE_ENV === 'development' &&
    pool?.pool_assets &&
    tokenAssetIndex < 0 &&
    tokenSymbol &&
    poolId
  ) {
    throw new Error(
      `Provided token ${tokenSymbol} doesn't exist in the pool ${poolId}.`
    )
  }

  return [amount, isLoading] as const
}
