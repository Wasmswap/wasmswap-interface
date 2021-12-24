import { useQuery } from 'react-query'
import { getSwapInfo, InfoResponse } from '../services/swap'
import { useTokenInfo } from './useTokenInfo'

export const useSwapInfo = ({ tokenSymbol }) => {
  const tokenInfo = useTokenInfo(tokenSymbol)
  const { data = {} as InfoResponse, isLoading } = useQuery<InfoResponse>(
    `swapInfo/${tokenInfo.swap_address}`,
    async () => {
      return await getSwapInfo(
        tokenInfo.swap_address,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )
    },
    {
      enabled: Boolean(tokenInfo.swap_address),
    }
  )

  return [data, isLoading] as const
}
