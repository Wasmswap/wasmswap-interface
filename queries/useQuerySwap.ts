import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'
import { useTokenToTokenPrice } from '../features/swap'
import { tokenSwapAtom } from '../features/swap/swapAtoms'
import { useCosmWasmClient } from '../hooks/useCosmWasmClient'
import { querySwapInfo } from './querySwapInfo'

export const useQuerySwapInfo = () => {
  return useQuery('swapInfo', async () => {
    const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

    const [tokenToTokenPrice] = useTokenToTokenPrice({
      tokenASymbol: tokenA.tokenSymbol,
      tokenBSymbol: tokenB.tokenSymbol,
      tokenAmount: 0,
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

    return await querySwapInfo({ context: { client }, swap_address })
  })
}
