import { useQuery } from 'react-query'
import { getSwapInfo } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'

export const useLiquidity = ({ tokenName, address, swapAddress }) => {
  const {
    data: { native_reserve, lp_token_supply } = {},
    isLoading: fetchingTotalLiquidity,
  } = useQuery(
    [`swapInfo/${tokenName}`, swapAddress],
    async () => {
      return await getSwapInfo(
        swapAddress,
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT
      )
    },
    {
      enabled: Boolean(swapAddress),
    }
  )

  const {
    data: { myLiquidity, myLPBalance } = {},
    isLoading: fetchingMyLiquidity,
  } = useQuery(
    [`myLiquidity/${tokenName}`, address, native_reserve, lp_token_supply],
    async () => {
      const balance = await getLiquidityBalance({
        address: address,
        swapAddress: swapAddress,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      })
      return {
        myLiquidity:
          ((Number(balance) / Number(lp_token_supply)) *
            Number(native_reserve) *
            2) /
          1000000,
        myLPBalance: Number(balance),
      }
    },
    {
      enabled: Boolean(
        swapAddress && address && native_reserve && lp_token_supply
      ),
    }
  )

  return {
    totalLiquidity: native_reserve ? (Number(native_reserve) * 2) / 1000000 : 0,
    myLiquidity: myLiquidity ? myLiquidity : undefined,
    myLPBalance: myLPBalance,
    isLoading: fetchingMyLiquidity || fetchingTotalLiquidity,
  }
}
