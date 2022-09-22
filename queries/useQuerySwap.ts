import { useQuery } from 'react-query'
import { useTokenToTokenPrice } from '../features/swap'
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { querySwapInfo } from './querySwapInfo'

export const useQuerySwapInfo = ({
  tokenASymbol,
  tokenBSymbol,
}: {
  tokenASymbol: string
  tokenBSymbol: string
}) => {
  const [tokenToTokenPrice] = useTokenToTokenPrice({
    tokenASymbol,
    tokenBSymbol,
    tokenAmount: 1,
  })
  const {
    poolForDirectTokenAToTokenBSwap,
    poolForDirectTokenBToTokenASwap,
    passThroughPools,
  } = tokenToTokenPrice
  const client = useCosmWasmClient()
  const poolAddress =
    poolForDirectTokenAToTokenBSwap?.swap_address ??
    poolForDirectTokenBToTokenASwap?.swap_address

  return useQuery(
    ['swapInfo', tokenASymbol, tokenBSymbol, poolAddress, passThroughPools],
    async () => {
      if (poolAddress != undefined) {
        return feeFromSwapInfo(
          await querySwapInfo({
            context: { client },
            swap_address: poolAddress,
          })
        )
      }

      if (!passThroughPools) return undefined

      const swapInfos = await Promise.all(
        passThroughPools
          .map((p) => [
            querySwapInfo({
              context: { client },
              swap_address: p.inputPool.swap_address,
            }),
            querySwapInfo({
              context: { client },
              swap_address: p.outputPool.swap_address,
            }),
          ])
          .flat()
      )
      return swapInfos.reduce(
        (sum, swapInfo) => sum + feeFromSwapInfo(swapInfo),
        0
      )
    }
  )
}

export const feeFromSwapInfo = ({
  lp_fee_percent,
  protocol_fee_percent,
}: Awaited<ReturnType<typeof querySwapInfo>>): number =>
  (lp_fee_percent != undefined ? lp_fee_percent : 0.3) +
  (protocol_fee_percent != undefined ? protocol_fee_percent : 0)
