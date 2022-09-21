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
    // TODO(1): Pass through pools swap info
    // passThroughPools,
  } = tokenToTokenPrice
  const client = useCosmWasmClient()
  const swap_address =
    poolForDirectTokenAToTokenBSwap?.swap_address ??
    poolForDirectTokenBToTokenASwap?.swap_address

  console.log(tokenASymbol, tokenBSymbol, tokenToTokenPrice, swap_address)

  return useQuery(
    ['swapInfo', tokenASymbol, tokenBSymbol],
    async () => {
      return await querySwapInfo({ context: { client }, swap_address })
    }
  )
}

export const feeFromSwapInfo = ({
  lp_fee_percent,
  protocol_fee_percent,
}: Awaited<ReturnType<typeof querySwapInfo>>): number =>
  (lp_fee_percent != undefined ? lp_fee_percent : 0.3) +
  (protocol_fee_percent != undefined ? protocol_fee_percent : 0)
