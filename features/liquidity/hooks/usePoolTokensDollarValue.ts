import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import { calcPoolTokenValue } from 'util/conversion'
import { useCallback } from 'react'

export const useGetPoolTokensDollarValue = () => {
  const tokenA = useBaseTokenInfo()
  const [tokenAPrice, isPriceLoading] = useTokenDollarValue(tokenA?.symbol)

  const enabled = !isPriceLoading

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
    !enabled,
  ] as const
}

export const usePoolTokensDollarValue = ({
  poolId,
  tokenAmountInMicroDenom,
}) => {
  const [getPoolTokensDollarValue, enabled] = useGetPoolTokensDollarValue()

  const [swapInfo, isLoading] = useSwapInfo({ poolId })

  if (swapInfo) {
    return [
      getPoolTokensDollarValue({ swapInfo, tokenAmountInMicroDenom }),
      isLoading || !enabled,
    ]
  }

  return [0, isLoading || !enabled]
}
