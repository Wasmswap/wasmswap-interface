import { TokenInfo } from '../hooks/useTokenList'

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

  return response.json()
}
