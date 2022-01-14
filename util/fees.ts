import { coins } from '@cosmjs/stargate'
import { ChainInfo } from '@keplr-wallet/types'
import { unsafelyReadChainInfoCache } from '../hooks/useChainInfo'

export const getDefaultExecuteFee = (
  feeCurrency: ChainInfo['feeCurrencies']
) => ({
  amount: coins(500000, feeCurrency[0].coinDenom),
  gas: '500000',
})

export const unsafelyGetDefaultExecuteFee = () => {
  /* hack: read chain info from query cache */
  const chainInfo = unsafelyReadChainInfoCache()

  /* throw an error if the function was called before the cache is available */
  if (!chainInfo) {
    throw new Error(
      'No chain info was presented in the cache. Seem to be an architectural issue. Contact developers.'
    )
  }

  return getDefaultExecuteFee(chainInfo.feeCurrencies)
}
