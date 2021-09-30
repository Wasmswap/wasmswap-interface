import { useQuery, useQueryClient } from 'react-query'
import { getSwapInfo } from '../services/swap'
import { getLiquidityBalance } from '../services/liquidity'
import { useCallback } from 'react'

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

  const { data: myLiquidity, isLoading: fetchingMyLiquidity } = useQuery(
    [`myLiquidity/${tokenName}`, address, native_reserve, lp_token_supply],
    async () => {
      const balance = await getLiquidityBalance({
        address: address,
        swapAddress: swapAddress,
        rpcEndpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      })
      return (
        ((Number(balance) / Number(lp_token_supply)) *
          Number(native_reserve) *
          2) /
        1000000
      )
    },
    {
      enabled: Boolean(
        swapAddress && address && native_reserve && lp_token_supply
      ),
      onSuccess() {
        console.log(
          'fetched myLiquidity',
          `myLiquidity/${tokenName}`,
          address,
          native_reserve,
          lp_token_supply
        )
      },
    }
  )

  return {
    totalLiquidity: native_reserve ? (Number(native_reserve) * 2) / 1000000 : 0,
    myLiquidity: myLiquidity ? myLiquidity : 0,
    isLoading: fetchingMyLiquidity || fetchingTotalLiquidity,
  }
}

export const useInvalidateLiquidity = (tokenName?: string) => {
  const queryClient = useQueryClient()

  function invalidateLiquidity() {
    const queryKeys = [
      `swapInfo${tokenName ? `/${tokenName}` : ''}`,
      `myLiquidity${tokenName ? `/${tokenName}` : ''}`,
    ]
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries(queryKey)
      queryClient.refetchQueries(queryKey)
    })
  }

  return useCallback(invalidateLiquidity, [queryClient, tokenName])
}
