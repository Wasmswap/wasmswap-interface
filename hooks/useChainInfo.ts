import { useQuery } from 'react-query'
import { ChainInfo } from '@keplr-wallet/types'

export const useChainInfo = () => {
  const { data, isLoading } = useQuery<ChainInfo>(
    '@chain-info',
    async () => {
      const response = await fetch(process.env.NEXT_PUBLIC_CHAIN_INFO_URL)
      return await response.json()
    },
    {
      onError(e) {
        console.error('Error loading chain info:', e)
      },
    }
  )

  return [data, isLoading] as const
}
