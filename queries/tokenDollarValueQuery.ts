import { TokenInfo } from './usePoolsListQuery'

export async function tokenDollarValueQuery(tokenIds: Array<TokenInfo['id']>) {
  const prices = await fetchTokensPrice(tokenIds)
  return tokenIds.map((id): number => prices[id]?.usd || 0)
}

async function fetchTokensPrice(tokenIds: Array<string>) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(
      ','
    )}&vs_currencies=usd`,
    {
      method: 'GET',
    }
  )

  if (!response.ok) {
    throw new Error('Cannot fetch dollar price from the API.')
  }

  return response.json()
}
