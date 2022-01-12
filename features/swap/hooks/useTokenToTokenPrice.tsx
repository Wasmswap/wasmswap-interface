import { useQuery } from 'react-query'
import {
  getToken1ForToken2Price,
  getToken2ForToken1Price,
  getTokenForTokenPrice,
} from '../../../services/swap'
import { getBaseToken, getTokenInfo } from '../../../hooks/useTokenInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../../../util/constants'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
} from 'util/conversion'

export const useTokenToTokenPrice = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
}) => {
  const { data, isLoading } = useQuery(
    [
      `tokenToTokenPrice/${tokenBSymbol}/${tokenASymbol}/${tokenAmount}`,
      tokenASymbol,
      tokenBSymbol,
      tokenAmount,
    ],
    async ({
      queryKey: [, symbolForTokenA, symbolForTokenB, amount],
    }): Promise<number | undefined> => {
      const fromTokenInfo = getTokenInfo(symbolForTokenA)
      const toTokenInfo = getTokenInfo(symbolForTokenB)

      const baseToken = getBaseToken()
      const formatPrice = (price) =>
        convertMicroDenomToDenom(price, toTokenInfo.decimals)

      const convertedTokenAmount = convertDenomToMicroDenom(
        amount,
        fromTokenInfo.decimals
      )

      if (fromTokenInfo.symbol === baseToken.symbol) {
        return formatPrice(
          await getToken1ForToken2Price({
            nativeAmount: convertedTokenAmount,
            swapAddress: toTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      } else if (toTokenInfo.symbol === baseToken.symbol) {
        return formatPrice(
          await getToken2ForToken1Price({
            tokenAmount: convertedTokenAmount,
            swapAddress: fromTokenInfo.swap_address,
            rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
          })
        )
      }

      return formatPrice(
        await getTokenForTokenPrice({
          tokenAmount: convertedTokenAmount,
          swapAddress: fromTokenInfo.swap_address,
          outputSwapAddress: toTokenInfo.swap_address,
          rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string,
        })
      )
    },
    {
      enabled: Boolean(
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
