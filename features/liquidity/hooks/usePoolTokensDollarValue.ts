import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import {
  PoolEntityType,
  usePoolFromListQueryById,
} from 'queries/usePoolsListQuery'
import { useCallback } from 'react'
import { calcPoolTokenValue } from 'util/conversion'

type UseGetPoolTokensDollarValueArgs = {
  poolId: PoolEntityType['pool_id']
}

export const useGetPoolTokensDollarValue = ({
  poolId,
}: UseGetPoolTokensDollarValueArgs) => {
  const [pool] = usePoolFromListQueryById({ poolId })
  const [tokenAPrice, isPriceLoading] = useTokenDollarValue(
    pool?.pool_assets[0].symbol
  )

  const enabled = pool && typeof tokenAPrice === 'number' && !isPriceLoading

  return [
    useCallback(
      function getPoolTokensDollarValue({ swapInfo, tokenAmountInMicroDenom }) {
        if (swapInfo) {
          return (
            calcPoolTokenValue({
              tokenAmountInMicroDenom,
              tokenSupply: swapInfo.lp_token_supply,
              tokenReserves: swapInfo.token1_reserve,
            }) *
            tokenAPrice *
            2
          )
        }
        return 0
      },
      [tokenAPrice]
    ),
    enabled,
  ] as const
}

type UsePoolTokensDollarValueArgs = {
  poolId: string
  tokenAmountInMicroDenom: number
}

export const usePoolTokensDollarValue = ({
  poolId,
  tokenAmountInMicroDenom,
}: UsePoolTokensDollarValueArgs) => {
  const [getPoolTokensDollarValue, enabled] = useGetPoolTokensDollarValue({
    poolId,
  })

  const [swapInfo, isLoading] = useSwapInfo({ poolId })

  if (swapInfo) {
    return [
      getPoolTokensDollarValue({ swapInfo, tokenAmountInMicroDenom }),
      isLoading || !enabled,
    ] as const
  }

  return [0, isLoading || !enabled] as const
}
