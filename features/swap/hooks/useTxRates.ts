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

function calculateTokenToTokenConversionDollarRate({
  conversionRate,
  tokenADollarPrice,
  oneTokenToTokenPrice,
  tokenAAmount,
}) {
  if (tokenAAmount === 0) {
    return tokenADollarPrice
  }

  return (tokenADollarPrice * conversionRate) / oneTokenToTokenPrice
}

export const useTxRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  tokenToTokenPrice,
  isLoading,
}) => {
  const [tokenADollarPrice, fetchingTokenDollarPrice] =
    useTokenDollarValue(tokenASymbol)

  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
  })

  const dollarValue = (tokenADollarPrice || 0) * (tokenAAmount || 0)

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

  const conversionRateInDollar = usePersistance(
    isLoading || fetchingTokenDollarPrice || !shouldShowRates
      ? undefined
      : protectAgainstNaN(
          calculateTokenToTokenConversionDollarRate({
            tokenAAmount,
            conversionRate,
            tokenADollarPrice,
            oneTokenToTokenPrice,
          })
        )
  )

  return {
    isShowing: Boolean(shouldShowRates),
    conversionRate,
    conversionRateInDollar,
    dollarValue,
  }
}
