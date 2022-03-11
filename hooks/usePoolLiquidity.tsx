import { useQueries } from 'react-query'
import { getLiquidityBalance } from '../services/liquidity'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useBaseTokenInfo, useTokenInfoByPoolIds } from './useTokenInfo'
import { useTokenDollarValue } from './useTokenDollarValue'
import { convertMicroDenomToDenom, protectAgainstNaN } from 'util/conversion'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useChainInfo } from './useChainInfo'
import { useMultipleSwapInfo } from './useSwapInfo'
import { useMemo } from 'react'
import { getTotalStakedBalance } from '../services/staking'
import { useMultipleRewardsInfo } from './useRewardsQueries'
import { useGetPoolTokensDollarValue } from '../features/liquidity/hooks/usePoolTokensDollarValue'

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

  const poolsInfo = useTokenInfoByPoolIds(poolIds)

  const [swaps, fetchingSwaps] = useMultipleSwapInfo({
    poolIds,
    refetchInBackground,
  })

  const rewardsContractsInfo = useMultipleRewardsInfo({
    swapAddresses: useMemo(
      () => poolsInfo?.map((poolInfo) => poolInfo?.swap_address),
      [poolsInfo]
    ),
  })

  const serializedQueriesData = useMemo(() => {
    const queriesData = swaps?.map((swap) => {
      const poolInfoForSwap = poolsInfo?.find(
        ({ swap_address }) => swap.swap_address === swap_address
      )
      /*
       * note: this works only if we're assuming the first token pair is always one token
       * */
      const rewardsContractResponse = rewardsContractsInfo.find(
        ({ data }) => data && data?.swap_address === swap.swap_address
      )
      return {
        swap,
        poolInfo: poolInfoForSwap,
        rewardsContracts: rewardsContractResponse?.data,
      }
    })
    const loadingRewardsContracts =
      !rewardsContractsInfo ||
      rewardsContractsInfo.some(({ isLoading }) => isLoading)
    return {
      queriesData,
      loadingRewardsContracts,
    }
  }, [swaps, poolsInfo, rewardsContractsInfo])

  const [getPoolTokensDollarValue, getPoolTokensDollarValueEnabled] =
    useGetPoolTokensDollarValue()

  const queriesResult = useQueries(
    (serializedQueriesData.queriesData ?? []).map(
      ({ swap, poolInfo, rewardsContracts }) => ({
        queryKey: [
          'myLiquidity',
          getPoolTokensDollarValueEnabled,
          swap.lp_token_address,
          serializedQueriesData.loadingRewardsContracts,
          address,
        ],
        async queryFn() {
          const {
            lp_token_address,
            token1_reserve,
            token2_reserve,
            lp_token_supply,
          } = swap

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

          const rewardsInfo = {
            totalStakedInMicroDenom: undefined,
            totalStakedDollarValue: undefined,
            yieldPercentageReturn: undefined,
          }

          if (rewardsContracts) {
            rewardsInfo.totalStakedInMicroDenom = await getTotalStakedBalance(
              poolInfo.staking_address,
              chainInfo.rpc
            )
            rewardsInfo.totalStakedDollarValue =
              getPoolTokensDollarValue({
                swapInfo: swap,
                tokenAmountInMicroDenom: rewardsInfo.totalStakedInMicroDenom,
              }) || 1

            rewardsInfo.yieldPercentageReturn =
              rewardsContracts.contracts.reduce(
                (yieldReturnValue, rewardsContract) => {
                  return (
                    yieldReturnValue +
                    rewardsContract.rewardRate.ratePerYear.dollarValue /
                      rewardsInfo.totalStakedDollarValue
                  )
                },
                0
              )
          }

          return {
            reserve,
            myReserve,
            totalLiquidity,
            myLiquidity,
            rewardsInfo,
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
