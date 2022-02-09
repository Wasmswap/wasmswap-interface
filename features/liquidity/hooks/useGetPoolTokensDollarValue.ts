import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { useSwapInfo } from 'hooks/useSwapInfo'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import { calcPoolTokenValue } from 'util/conversion'

export const useGetPoolTokensDollarValue = ({
  poolId,
  tokenAmountInMicroDenom,
}) => {
  const tokenA = useBaseTokenInfo()

  const [swapInfo, isLoading] = useSwapInfo({ poolId })
  const [junoPrice, isPriceLoading] = useTokenDollarValue(tokenA?.symbol)

  if (swapInfo) {
    return [
      calcPoolTokenValue({
        tokenAmountInMicroDenom,
        tokenSupply: swapInfo.lp_token_supply,
        tokenReserves: swapInfo.token1_reserve,
      }) *
        junoPrice *
        2,
      isLoading || isPriceLoading,
    ]
  }

  return [0, isLoading || isPriceLoading]
}
