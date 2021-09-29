import { useQuery } from 'react-query'
import { getSwapInfo } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'

export const useLiquidity = ({ tokenName, address, swapAddress }) => {
  const {
    data: { native_reserve, lp_token_supply, ...etc } = {},
    isLoading: fetchingTotalLiquidity,
  } = useQuery(`totalLiquidity/${tokenName}`, () =>
    getSwapInfo(swapAddress, process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT)
  )

  console.log('totalLiquidityQuery', {
    native_reserve,
    lp_token_supply,
    ...etc,
  })

  const { data: myLiquidity, isLoading: fetchingMyLiquidity } = useQuery(
    [`myLiquidity/${tokenName}`, address, native_reserve, lp_token_supply],
    async () => {
      const balance = await getLiquidityBalance({
        address: address,
        swapAddress: swapAddress,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      })

      console.log({
        balance,
        lp_token_supply,
        native_reserve,
      })

      return (
        (Number(balance) / Number(lp_token_supply)) * Number(native_reserve) * 2
      )
    }
  )

  console.log(myLiquidity)

  return {
    totalLiquidity: native_reserve ? (Number(native_reserve) * 2) / 1000000 : 0,
    myLiquidity: myLiquidity ? myLiquidity : 0,
    isLoading: fetchingMyLiquidity || fetchingTotalLiquidity,
  }
}
