import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { CW20 } from '../services/cw20'
import { TokenInfo } from './useTokenInfo'
import { useQuery, useQueryClient } from 'react-query'
import { useCallback } from 'react'

export const useTokenBalance = ({ symbol, token_address }: TokenInfo) => {
  const { address, client } = useRecoilValue(walletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${symbol}`, address, token_address],
    async () => {
      if (symbol === 'JUNO') {
        const coin = await client.getBalance(address, 'ujuno')
        const amount = coin ? Number(coin.amount) : 0
        return amount / 1000000
      }

      if (token_address) {
        const balance = await CW20(client).use(token_address).balance(address)

        return Number(balance) / 1000000
      }
      return 0
    },
    {
      enabled: Boolean(address),
      onSuccess() {
        console.log(
          'fetched balance for',
          `tokenBalance/${symbol}`,
          address,
          token_address
        )
      },
    }
  )

  return { balance, isLoading }
}

export const useInvalidateBalances = (tokenSymbol?: string) => {
  const queryClient = useQueryClient()

  function invalidateBalances() {
    queryClient.refetchQueries()
  }

  return useCallback(invalidateBalances, [tokenSymbol, queryClient])
}
