import { useMemo } from 'react'
import { useQueries } from 'react-query'
import { useRecoilValue } from 'recoil'
import { convertMicroDenomToDenom, protectAgainstNaN } from 'util/conversion'

import { useGetPoolTokensDollarValue } from '../features/liquidity'
import { getLiquidityBalance } from '../services/liquidity'
import { getStakedBalance, getTotalStakedBalance } from '../services/staking'
import { walletState } from '../state/atoms/walletAtoms'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useChainInfo } from './useChainInfo'
import { usePersistance } from './usePersistance'
import { useMultipleRewardsInfo } from './useRewardsQueries'
import { useMultipleSwapInfo } from './useSwapInfo'
import { useTokenDollarValue } from './useTokenDollarValue'
import { useBaseTokenInfo, useTokenInfoByPoolIds } from './useTokenInfo'

export type LiquidityType = {
  tokenAmount: number
  dollarValue: number
}

export type LiquidityInfoType = {
  reserve: [number, number]
  totalLiquidity: LiquidityType
  myLiquidityReserve: [number, number]
  myStakedLiquidityReserve: [number, number]
  myLiquidity: LiquidityType
  myStakedLiquidity: LiquidityType
  /* pretty hacky - refactor when implementing decimals support */
  tokenDollarValue: number
  rewardsInfo: {
    totalStakedInMicroDenom: number | undefined
    totalStakedDollarValue: number | undefined
    yieldPercentageReturn: number | undefined
  }
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
}) => {
  const { address, client } = useRecoilValue(walletState)

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
        async queryFn(): Promise<LiquidityInfoType> {
          const tokenADecimals = tokenA.decimals

          const {
            lp_token_address,
            token1_reserve,
            token2_reserve,
            lp_token_supply,
          } = swap

          /* my liquidity math */
          const providedLiquidityBalance = await getLiquidityBalance({
            tokenAddress: lp_token_address,
            rpcEndpoint: chainInfo.rpc,
            address,
          })

          /* provide dollar value for reserves as well */
          const reserve: [number, number] = [
            protectAgainstNaN(token1_reserve),
            protectAgainstNaN(token2_reserve),
          ]

          const myLiquidityReserve: [number, number] = [
            protectAgainstNaN(
              reserve[0] * (providedLiquidityBalance / lp_token_supply)
            ),
            protectAgainstNaN(
              reserve[1] * (providedLiquidityBalance / lp_token_supply)
            ),
          ]

          const totalLiquidity = {
            tokenAmount: lp_token_supply,
            dollarValue:
              convertMicroDenomToDenom(reserve[0], tokenADecimals) *
              tokenADollarPrice *
              2,
          }

          const myLiquidity = {
            tokenAmount: providedLiquidityBalance,
            dollarValue:
              convertMicroDenomToDenom(myLiquidityReserve[0], tokenADecimals) *
              tokenADollarPrice *
              2,
          }

          /* staked liquidity math */
          const shouldQueryStakedBalance = address && poolInfo.staking_address
          const stakedBalanceInMicroDenom = shouldQueryStakedBalance
            ? await getStakedBalance(address, poolInfo.staking_address, client)
            : undefined

          const stakedBalance = stakedBalanceInMicroDenom
            ? convertMicroDenomToDenom(
                stakedBalanceInMicroDenom,
                tokenADecimals
              )
            : undefined

          const myStakedLiquidityReserve: [number, number] = [
            protectAgainstNaN(
              reserve[0] * (stakedBalanceInMicroDenom / lp_token_supply)
            ),
            protectAgainstNaN(
              reserve[1] * (stakedBalanceInMicroDenom / lp_token_supply)
            ),
          ]

          const myStakedLiquidity = {
            tokenAmount: stakedBalance || 0,
            dollarValue: stakedBalance
              ? stakedBalance * tokenADollarPrice * 2
              : 0,
          }

          /* rewards math */
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
            totalLiquidity,
            myLiquidityReserve,
            myStakedLiquidity,
            myStakedLiquidityReserve,
            myLiquidity,
            rewardsInfo,
            tokenDollarValue: tokenADollarPrice,
          }
        },
        queryKey: [
          'myLiquidity',
          getPoolTokensDollarValueEnabled,
          swap.lp_token_address,
          serializedQueriesData.loadingRewardsContracts,
          address,
        ],
        enabled: Boolean(chainInfo?.rpc && tokenA),
        refetchOnMount: 'always' as const,
        refetchInterval: refetchInBackground
          ? DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL
          : undefined,
        refetchIntervalInBackground: refetchInBackground,
      })
    )
  )

  const loading = fetchingSwaps || fetchingChainInfo || fetchingDollarPrice

  const [data, isLoading] = useMemo(() => {
    const loadingPools = queriesResult.some(
      ({ isLoading, data }) => isLoading && !data
    )

    if (loadingPools) {
      return [[], loadingPools || loading]
    }

    const pools = queriesResult.map(({ data }) => data)
    return [pools, loadingPools || loading] as const
  }, [loading, queriesResult])

  const persistData = usePersistance(
    data[0]?.reserve?.length ? data : undefined
  )

  return [persistData, isLoading] as const
}
