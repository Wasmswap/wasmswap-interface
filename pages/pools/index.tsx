import React, { useMemo, useState } from 'react'
import { media, styled } from 'components/theme'
import { AppLayout } from 'components/Layout/AppLayout'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { PoolCard } from 'features/liquidity/components/PoolCard'
import { ButtonWithDropdownForSorting } from 'features/liquidity/components/ButtonWithDropdownForSorting'
import { PageHeader } from 'components/Layout/PageHeader'
import { Inline } from 'components/Inline'
import { useMultiplePoolsLiquidity } from 'hooks/usePoolLiquidity'
import { Text } from 'components/Text'
import { Spinner } from 'components/Spinner'
import { useTokenList } from 'hooks/useTokenList'
import { Column } from 'components/Column'
import {
  SortDirections,
  SortParameters,
  useSortPools,
} from 'features/liquidity/hooks/useSortPools'
import { useUpdateEffect } from '@reach/utils'

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

  const shouldShowFetchingState = isLoading || !liquidity?.length
  const shouldRenderPools = !isLoading && Boolean(liquidity?.length)

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
                    totalLiquidity={liquidityInfo.totalLiquidity}
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
