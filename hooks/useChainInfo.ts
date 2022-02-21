import { useQuery } from 'react-query'
import { ChainInfo } from '@keplr-wallet/types'
import { queryClient } from '../services/queryClient'

export type AppChainInfo = {
  name: string
  base_chain: ChainInfo
  external_chains: Array<ChainInfo>
}

const chainInfoQueryKey = '@chain-info'

export const unsafelyReadChainInfoCache = () =>
  queryClient.getQueryCache().find(chainInfoQueryKey)?.state?.data as
    | AppChainInfo
    | undefined

export const useChainInfo = () =>
  useQuery<AppChainInfo>(
    chainInfoQueryKey,
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

export const useExternalChainsInfo = () => {
  const { data, isLoading } = useChainInfo()

  return [data?.external_chains, isLoading] as const
}

export const useBaseChainInfo = () => {
  const { data, isLoading } = useChainInfo()

  return [data?.base_chain, isLoading] as const
}
