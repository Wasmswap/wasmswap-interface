import { usePersistance } from 'junoblocks'
import { TokenInfo } from 'queries/usePoolsListQuery'

import { useTokenToTokenPrice } from './useTokenToTokenPrice'

type UsePriceForOneTokenArgs = {
  tokenASymbol: TokenInfo['symbol']
  tokenBSymbol: TokenInfo['symbol']
}

export const usePriceForOneToken = ({
  tokenASymbol,
  tokenBSymbol,
}: UsePriceForOneTokenArgs) => {
  const [{ price: currentTokenPrice }, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenASymbol,
    tokenBSymbol: tokenBSymbol,
    tokenAmount: 1,
  })

  const persistPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )

  return [persistPrice, isPriceLoading] as const
}
