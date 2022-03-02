import { useQueries } from 'react-query'
import { getLiquidityBalance } from '../services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useBaseTokenInfo } from './useTokenInfo'
import { useTokenDollarValue } from './useTokenDollarValue'
import { convertMicroDenomToDenom, protectAgainstNaN } from 'util/conversion'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useChainInfo } from './useChainInfo'
import { useMultipleSwapInfo } from './useSwapInfo'
import { useMemo } from 'react'

export type LiquidityType = {
  coins: number
  dollarValue: number
}

export type LiquidityInfoType = {
  reserve: [number, number]
  myReserve: [number, number]
  totalLiquidity: LiquidityType
  myLiquidity: LiquidityType
  /* pretty hacky - refactor when implementing decimals support */
  tokenDollarValue: number
}

export const usePoolLiquidity = ({ poolId }) => {
  const [liquidity, isLoading] = useMultiplePoolsLiquidity({
    poolIds: poolId ? [poolId] : undefined,
    refetchInBackground: true,
  })

  return [liquidity?.[0], isLoading] as const
}

export const useMultiplePoolsLiquidity = ({
  poolIds,
  refetchInBackground = false,
}): readonly [LiquidityInfoType[] | undefined, boolean] => {
  const { address } = useRecoilValue(walletState)

  const tokenA = useBaseTokenInfo()
  const [chainInfo, fetchingChainInfo] = useChainInfo()

  const [tokenADollarPrice, fetchingDollarPrice] = useTokenDollarValue(
    tokenA?.symbol
  )

  const [swaps, fetchingSwaps] = useMultipleSwapInfo({
    poolIds,
    refetchInBackground,
  })

  const queriesResult = useQueries(
    swaps?.map(
      ({
        lp_token_address,
        token1_reserve,
        token2_reserve,
        lp_token_supply,
        // swap_address: swapAddress,
      }) => ({
        queryKey: ['myLiquidity', lp_token_address, address],
        async queryFn() {
          const balance = await getLiquidityBalance({
            tokenAddress: lp_token_address,
            rpcEndpoint: chainInfo.rpc,
            address,
          })

          /* provide dollar value for reserves as well */
          const reserve: [number, number] = [
            protectAgainstNaN(token1_reserve),
            protectAgainstNaN(token2_reserve),
          ]

          const myReserve: [number, number] = [
            protectAgainstNaN(reserve[0] * (balance / lp_token_supply)),
            protectAgainstNaN(reserve[1] * (balance / lp_token_supply)),
          ]

          const tokenADecimals = tokenA.decimals

          const totalLiquidity = {
            coins: lp_token_supply,
            dollarValue:
              convertMicroDenomToDenom(reserve[0], tokenADecimals) *
              tokenADollarPrice *
              2,
          }

          const myLiquidity = {
            coins: balance,
            dollarValue:
              convertMicroDenomToDenom(myReserve[0], tokenADecimals) *
              tokenADollarPrice *
              2,
          }

          // const rewardsContract = rewardsContracts.find(
          //   ({ swap_address }) => swapAddress === swap_address
          // )

          return {
            reserve,
            myReserve,
            totalLiquidity,
            myLiquidity,
            tokenDollarValue: tokenADollarPrice,
          }
        },
        enabled: Boolean(chainInfo?.rpc),
        refetchOnMount: 'always' as const,
        refetchInterval: refetchInBackground
          ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
          : undefined,
        refetchIntervalInBackground: refetchInBackground,
      })
    )
  )

  const loading = fetchingSwaps || fetchingChainInfo || fetchingDollarPrice

  return useMemo(() => {
    const pools = []
    let hasLoadingPool

    queriesResult.forEach(({ data, isLoading }) => {
      if (isLoading) {
        hasLoadingPool = isLoading
      }

      if (data) {
        pools.push(data)
      }
    })

    return [pools, hasLoadingPool || loading]
  }, [loading, queriesResult])
}
