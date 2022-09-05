import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import { usePersistance } from 'junoblocks'
import { protectAgainstNaN } from 'util/conversion'

import { usePriceForOneToken } from './usePriceForOneToken'

function calculateTokenToTokenConversionRate({
  tokenAAmount,
  tokenToTokenPrice,
  oneTokenToTokenPrice,
}) {
  if (tokenAAmount === 0) {
    return oneTokenToTokenPrice
  }

  return tokenToTokenPrice / tokenAAmount
}

export const useTxRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  tokenToTokenPrice,
  isLoading,
}) => {
  const [_, fetchingTokenDollarPrice] = useTokenDollarValue(tokenASymbol)

  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
  })

  const shouldShowRates =
    (tokenASymbol &&
      tokenBSymbol &&
      tokenToTokenPrice > 0 &&
      typeof tokenAAmount === 'number' &&
      typeof tokenToTokenPrice === 'number') ||
    (oneTokenToTokenPrice && tokenAAmount === 0)

  const conversionRate = usePersistance(
    isLoading || fetchingTokenDollarPrice || !shouldShowRates
      ? undefined
      : protectAgainstNaN(
          calculateTokenToTokenConversionRate({
            tokenAAmount,
            tokenToTokenPrice,
            oneTokenToTokenPrice,
          })
        )
  )

  const [tokenBDollarValue] = useTokenDollarValue(tokenBSymbol)
  const conversionRateInDollar = usePersistance(
    isLoading || fetchingTokenDollarPrice || !shouldShowRates
      ? undefined
      : protectAgainstNaN(conversionRate * tokenBDollarValue)
  )

  const dollarValue =
    (tokenBDollarValue || 0) * (tokenAAmount * conversionRate || 0)

  return {
    isShowing: Boolean(shouldShowRates),
    conversionRate,
    conversionRateInDollar,
    dollarValue,
  }
}
