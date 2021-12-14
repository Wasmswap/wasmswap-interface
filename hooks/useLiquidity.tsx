import { useQuery } from 'react-query'
import { getSwapInfo } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'

export const useLiquidity = ({ tokenSymbol, address, swapAddress }) => {
  const {
    data: { token1_reserve, token2_reserve, lp_token_supply, lp_token_address } = {},
    isLoading: fetchingTotalLiquidity,
  } = useQuery(
    [`swapInfo/${tokenSymbol}`, swapAddress],
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
    data: { myLiquidityCoins } = {},
    isLoading: fetchingMyLiquidity,
  } = useQuery(
    [`myLiquidity/${tokenSymbol}`, address, token1_reserve, lp_token_supply, lp_token_address],
    async () => {
      console.log(lp_token_address)
      const balance = await getLiquidityBalance({
        address: address,
        tokenAddress: lp_token_address,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      })
      console.log(balance)
      return {
        myLiquidityCoins: Number(balance),
      }
    },
    {
      enabled: Boolean(
        swapAddress && address && token1_reserve && lp_token_supply
      ),
    }
  )
  console.log("start");
  console.log(+token1_reserve * (+myLiquidityCoins/+lp_token_supply))
  console.log((+token1_reserve * (+myLiquidityCoins/+lp_token_supply)) / 1000000)

  console.log(lp_token_supply)
  console.log(myLiquidityCoins)
  return {
    totalLiquidityCoins: +lp_token_supply,
    myLiquidityCoins: +myLiquidityCoins,
    token1_reserve: +token1_reserve,
    token2_reserve: +token2_reserve,
    myToken1Reserve: +token1_reserve * (+myLiquidityCoins/+lp_token_supply),
    myToken2Reserve: +token2_reserve * (+myLiquidityCoins/+lp_token_supply),
    isLoading: fetchingMyLiquidity || fetchingTotalLiquidity,
  }
}
