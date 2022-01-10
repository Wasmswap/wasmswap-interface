import { useQuery } from 'react-query'
import { getSwapInfo, InfoResponse } from '../services/swap'
import { useTokenInfo } from './useTokenInfo'
import { useChainInfo } from './useChainInfo'

type SwapInfo = Pick<
  InfoResponse,
  'token1_denom' | 'token2_denom' | 'lp_token_address'
> & {
  lp_token_supply: number
  token1_reserve: number
  token2_reserve: number
}

export const useSwapInfo = ({ tokenSymbol }) => {
  const tokenInfo = useTokenInfo(tokenSymbol)
  const [chainInfo] = useChainInfo()
  const { data = {} as Record<string, undefined>, isLoading } =
    useQuery<SwapInfo>(
      `swapInfo/${tokenInfo.swap_address}`,
      async () => {
        const swap = await getSwapInfo(tokenInfo.swap_address, chainInfo.rpc)

        return {
          ...swap,
          token1_reserve: Number(swap.token1_reserve),
          token2_reserve: Number(swap.token2_reserve),
          lp_token_supply: Number(swap.lp_token_supply),
        }
      },
      {
        enabled: Boolean(tokenInfo?.swap_address && chainInfo?.rpc),
      }
    )

  return [data, isLoading] as const
}
