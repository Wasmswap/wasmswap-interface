import { TokenInfo } from 'hooks/useTokenList'

import { dollarPriceFetcher } from './DollarPriceFetcher'
import { pricingServiceIsDownAlert } from './pricingServiceIsDownAlert'

export async function tokenDollarValueQuery(tokenIds: Array<TokenInfo['id']>) {
  if (!tokenIds?.length) {
    throw new Error('Provide token ids in order to query their price')
  }

  const prices = await fetchTokensPrice(tokenIds)
  return tokenIds.map((id): number => prices[id]?.usd || 0)
}

async function fetchTokensPrice(tokenIds: Array<string>) {
  try {
    return await dollarPriceFetcher.fetch(tokenIds)
  } catch (e) {
    pricingServiceIsDownAlert()

    throw e
  }
}
