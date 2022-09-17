import { AppLayout, PageHeader } from 'components'
import {
  ButtonWithDropdownForSorting,
  PoolCard,
  SortDirections,
  SortParameters,
  useSortPools,
} from 'features/liquidity'
import {
  Column,
  ErrorIcon,
  Inline,
  media,
  Spinner,
  styled,
  Text,
} from 'junoblocks'
import React, { useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { useQueriesDataSelector } from '../../hooks/useQueriesDataSelector'
import { usePoolsListQuery } from '../../queries/usePoolsListQuery'
import { useQueryMultiplePoolsLiquidity } from '../../queries/useQueryPools'

export default function Pools() {
  const { data: poolsListResponse } = usePoolsListQuery()
  const [pools, isLoading, isError] = useQueriesDataSelector(
    useQueryMultiplePoolsLiquidity({
      refetchInBackground: false,
      pools: poolsListResponse?.pools,
    })
  )

  const { sortDirection, sortParameter, setSortDirection, setSortParameter } =
    useSortControllers()

  const [myPools, allPools] = useSortPools({
    pools,
    sortBy: useMemo(
      () => ({
        parameter: sortParameter,
        direction: sortDirection,
      }),
      [sortParameter, sortDirection]
    ),
  })

  const shouldShowFetchingState = isLoading && !pools?.length
  const shouldRenderPools = Boolean(pools?.length)

  const pageHeaderContents = (
    <PageHeader
      title="Liquidity"
      subtitle="Provide liquidity to the market and
        receive swap fees from each trade."
    />
  )

  if (isError) {
    return (
      <AppLayout>
        {pageHeaderContents}
        <Column
          justifyContent="center"
          align="center"
          css={{ paddingTop: '$24' }}
        >
          <Inline gap={2}>
            <ErrorIcon color="error" />
            <Text variant="primary">
              {
                "Oops, we've messed up querying the pools. Please come back later."
              }
            </Text>
          </Inline>
        </Column>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {pageHeaderContents}

      {shouldShowFetchingState && (
        <>
          <Column
            justifyContent="center"
            align="center"
            css={{ paddingTop: '$24' }}
          >
            <Spinner size={32} color="primary" />
          </Column>
        </>
      )}

      {shouldRenderPools && (
        <>
          {Boolean(myPools?.length) && (
            <>
              <Text variant="primary" css={{ paddingBottom: '$11' }}>
                Your Liquidity Pools
              </Text>

              <StyledDivForPoolsGrid>
                {myPools.map(
                  ({
                    liquidity,
                    pool_id,
                    pool_assets: [tokenA, tokenB],
                    rewards_tokens,
                  }) => (
                    <PoolCard
                      key={pool_id}
                      tokenASymbol={tokenA.symbol}
                      poolId={pool_id}
                      rewardsTokens={rewards_tokens}
                      tokenBSymbol={tokenB.symbol}
                      providedTotalLiquidity={liquidity.providedTotal}
                      stakedLiquidity={liquidity.staked}
                      availableLiquidity={liquidity.available}
                      aprValue={liquidity.rewards.annualYieldPercentageReturn}
                    />
                  )
                )}
              </StyledDivForPoolsGrid>
              {Boolean(allPools?.length) && (
                <Inline
                  gap={4}
                  css={{
                    paddingTop: '$19',
                    paddingBottom: '$11',
                  }}
                >
                  <Text variant="primary">{allPools.length} Other Pools</Text>
                  <ButtonWithDropdownForSorting
                    sortParameter={sortParameter}
                    sortDirection={sortDirection}
                    onSortParameterChange={setSortParameter}
                    onSortDirectionChange={setSortDirection}
                  />
                </Inline>
              )}
            </>
          )}
          <StyledDivForPoolsGrid>
            {allPools?.map(
              ({ liquidity, pool_id, pool_assets: [tokenA, tokenB] }) => (
                <PoolCard
                  key={pool_id}
                  tokenASymbol={tokenA.symbol}
                  poolId={pool_id}
                  tokenBSymbol={tokenB.symbol}
                  providedTotalLiquidity={liquidity.providedTotal}
                  stakedLiquidity={liquidity.staked}
                  availableLiquidity={liquidity.available}
                  aprValue={liquidity.rewards.annualYieldPercentageReturn}
                />
              )
            )}
          </StyledDivForPoolsGrid>
        </>
      )}
    </AppLayout>
  )
}

const useSortControllers = () => {
  const storeKeyForParameter = '@pools/sort/parameter'
  const storeKeyForDirection = '@pools/sort/direction'

  const [sortParameter, setSortParameter] = useState<SortParameters>(
    () =>
      (localStorage.getItem(storeKeyForParameter) as SortParameters) ||
      'liquidity'
  )
  const [sortDirection, setSortDirection] = useState<SortDirections>(
    () =>
      (localStorage.getItem(storeKeyForDirection) as SortDirections) || 'desc'
  )

  useUpdateEffect(() => {
    localStorage.setItem(storeKeyForParameter, sortParameter)
  }, [sortParameter])

  useUpdateEffect(() => {
    localStorage.setItem(storeKeyForDirection, sortDirection)
  }, [sortDirection])

  return {
    sortDirection,
    sortParameter,
    setSortDirection,
    setSortParameter,
  }
}

const StyledDivForPoolsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  columnGap: '$8',
  rowGap: '$8',

  '@media (max-width: 1360px)': {
    gridTemplateColumns: '1fr 1fr',
    columnGap: '$10',
    rowGap: '$12',
  },

  [media.sm]: {
    gridTemplateColumns: '1fr',
    rowGap: '$8',
  },
})
