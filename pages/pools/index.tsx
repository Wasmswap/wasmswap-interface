import { useUpdateEffect } from '@reach/utils'
import {
  AppLayout,
  Column,
  Inline,
  PageHeader,
  Spinner,
  Text,
} from 'components'
import {
  ButtonWithDropdownForSorting,
  PoolCard,
  SortDirections,
  SortParameters,
  useSortPools,
} from 'features/liquidity'
import { useMultiplePoolsLiquidity } from 'hooks/usePoolLiquidity'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { useTokenList } from 'hooks/useTokenList'
import React, { useMemo, useState } from 'react'
import { media, styled } from 'theme'

export default function Pools() {
  const { symbol: baseTokenSymbol } = useBaseTokenInfo() || {}

  const [supportedTokens, poolIds] = usePlatformPools()
  const [liquidity, isLoading] = useMultiplePoolsLiquidity({
    refetchInBackground: false,
    poolIds,
  })

  const { sortDirection, sortParameter, setSortDirection, setSortParameter } =
    useSortControllers()

  const [myPools, allPools] = useSortPools({
    liquidity,
    supportedTokens,
    sortBy: useMemo(
      () => ({
        parameter: sortParameter,
        direction: sortDirection,
      }),
      [sortParameter, sortDirection]
    ),
  })

  const shouldShowFetchingState = isLoading && !liquidity?.length
  const shouldRenderPools = Boolean(liquidity?.length)

  return (
    <AppLayout>
      <PageHeader
        title="Liquidity"
        subtitle="Provide liquidity to the market and
        receive swap fees from each trade."
      />

      {shouldShowFetchingState && (
        <>
          <Column
            justifyContent="center"
            align="center"
            css={{ paddingTop: '$24' }}
          >
            <Spinner size={32} color="black" />
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
                {myPools.map(({ liquidityInfo, tokenB }, key) => (
                  <PoolCard
                    key={key}
                    tokenASymbol={baseTokenSymbol}
                    poolId={tokenB.pool_id}
                    tokenBSymbol={tokenB.symbol}
                    myLiquidity={liquidityInfo.myLiquidity}
                    myStakedLiquidity={liquidityInfo.myStakedLiquidity}
                    totalLiquidity={liquidityInfo.totalLiquidity}
                    rewardsInfo={liquidityInfo.rewardsInfo}
                  />
                ))}
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
            {allPools?.map(({ liquidityInfo, tokenB }, key) => (
              <PoolCard
                key={key}
                tokenASymbol={baseTokenSymbol}
                poolId={tokenB.pool_id}
                tokenBSymbol={tokenB.symbol}
                myLiquidity={liquidityInfo.myLiquidity}
                totalLiquidity={liquidityInfo.totalLiquidity}
                myStakedLiquidity={liquidityInfo.myStakedLiquidity}
                rewardsInfo={liquidityInfo?.rewardsInfo}
              />
            ))}
          </StyledDivForPoolsGrid>
        </>
      )}
    </AppLayout>
  )
}

const usePlatformPools = () => {
  const [tokenList] = useTokenList()

  return useMemo(() => {
    const tokensCollection =
      tokenList?.tokens.filter(({ swap_address }) => Boolean(swap_address)) ??
      []

    const poolIdsCollection = tokensCollection
      .map(({ pool_id }) => pool_id)
      .filter(Boolean)

    return [tokensCollection, poolIdsCollection] as const
  }, [tokenList])
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
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  columnGap: '$8',
  rowGap: '$8',

  '@media (max-width: 1550px)': {
    gridTemplateColumns: '1fr 1fr 1fr',
  },

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
