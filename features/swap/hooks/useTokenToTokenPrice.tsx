import { useChainInfo } from 'hooks/useChainInfo'
import { useBaseTokenInfo, useGetMultipleTokenInfo } from 'hooks/useTokenInfo'
import { useMemo } from 'react'
import { useQueries } from 'react-query'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

import { TokenInfo } from '../../../hooks/useTokenList'
import { tokenToTokenPriceQuery } from '../../../queries/tokenToTokenPriceQuery'
import { cosmWasmClientRouter } from '../../../util/cosmWasmClientRouter'

type UseTokenPairsPricesArgs = {
  tokenPairs: Array<{
    tokenASymbol: TokenInfo['symbol']
    tokenBSymbol: TokenInfo['symbol']
    tokenAmount: number
  }>
  enabled?: boolean
  refetchInBackground?: boolean
}

export const useTokenPairsPrices = ({
  tokenPairs,
  enabled = true,
  refetchInBackground,
}: UseTokenPairsPricesArgs) => {
  const [chainInfo] = useChainInfo()
  const getMultipleTokenInfo = useGetMultipleTokenInfo()
  const baseToken = useBaseTokenInfo()

  return useQueries(
    tokenPairs?.map(({ tokenASymbol, tokenBSymbol, tokenAmount }) => ({
      queryKey: [
        `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
        chainInfo,
        tokenAmount,
      ],
      async queryFn() {
        const client = await cosmWasmClientRouter.connect(chainInfo.rpc)

        const [fromTokenInfo, toTokenInfo] = getMultipleTokenInfo([
          tokenASymbol,
          tokenBSymbol,
        ])

        const tokenPrice = await tokenToTokenPriceQuery({
          baseToken,
          fromTokenInfo,
          toTokenInfo,
          client,
          amount: tokenAmount,
        })

        return {
          tokenPrice,
          tokenASymbol,
          tokenBSymbol,
          tokenAmount,
        }
      },
      enabled: Boolean(
        enabled &&
          chainInfo?.rpc &&
          baseToken &&
          tokenBSymbol &&
          tokenASymbol &&
          tokenAmount > 0 &&
          tokenBSymbol !== tokenASymbol
      ),
      refetchOnMount: 'always' as const,
      refetchInterval: refetchInBackground
        ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
        : undefined,
      refetchIntervalInBackground: Boolean(refetchInBackground),
    }))
  )
}

export const useTokenToTokenPrice = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
}) => {
  const [{ data, isLoading }] = useTokenPairsPrices({
    tokenPairs: useMemo(
      () => [{ tokenASymbol, tokenBSymbol, tokenAmount }],
      [tokenASymbol, tokenBSymbol, tokenAmount]
    ),
    refetchInBackground: true,
  })

  return [data?.tokenPrice, isLoading] as const
}
