import { useQuery } from 'react-query'
import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from 'services/swap'
import { useBaseTokenInfo, useTokenInfo } from 'hooks/useTokenInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion'
import { useBaseChainInfo } from 'hooks/useChainInfo'

export const useTokenToTokenPrice = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
}) => {
  const [chainInfoReference] = useBaseChainInfo()
  const baseToken = useBaseTokenInfo()

  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const { data, isLoading } = useQuery(
    [
      `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
      tokenA,
      tokenB,
      chainInfoReference,
      tokenAmount,
    ],
    async ({
      queryKey: [, fromTokenInfo, toTokenInfo, chainInfo, amount],
    }): Promise<number | undefined> => {
      const formatPrice = (price) =>
        convertMicroDenomToDenom(price, toTokenInfo.decimals)

      const convertedTokenAmount = convertDenomToMicroDenom(
        amount,
        fromTokenInfo.decimals
      )

      if (
        fromTokenInfo.symbol === baseToken.symbol &&
        toTokenInfo.swap_address
      ) {
        return formatPrice(
          await getToken1ForToken2Price({
            nativeAmount: convertedTokenAmount,
            swapAddress: toTokenInfo.swap_address,
            rpcEndpoint: chainInfo.rpc,
          })
        )
      } else if (
        toTokenInfo.symbol === baseToken.symbol &&
        fromTokenInfo.swap_address
      ) {
        return formatPrice(
          await getToken2ForToken1Price({
            tokenAmount: convertedTokenAmount,
            swapAddress: fromTokenInfo.swap_address,
            rpcEndpoint: chainInfo.rpc,
          })
        )
      }

      return formatPrice(
        await getTokenForTokenPrice({
          tokenAmount: convertedTokenAmount,
          swapAddress: fromTokenInfo.swap_address,
          outputSwapAddress: toTokenInfo.swap_address,
          rpcEndpoint: chainInfo.rpc,
        })
      )
    },
    {
      enabled: Boolean(
        chainInfoReference?.rpc &&
          baseToken &&
          tokenBSymbol &&
          tokenASymbol &&
          tokenAmount > 0 &&
          tokenBSymbol !== tokenASymbol
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
