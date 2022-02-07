import React, { useMemo } from 'react'
import { media, styled } from 'components/theme'
import { AppLayout } from 'components/Layout/AppLayout'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { PoolCard } from 'features/liquidity/components/PoolCard'
import { PageHeader } from 'components/Layout/PageHeader'
import { useMultiplePoolsLiquidity } from 'hooks/usePoolLiquidity'
import { Text } from 'components/Text'
import { Spinner } from 'components/Spinner'
import { useTokenList } from 'hooks/useTokenList'
import { Column } from '../../components/Column'

export default function Pools() {
  const [supportedTokens, poolIds] = usePlatformPools()
  const [liquidity, isLoading] = useMultiplePoolsLiquidity({
    refetchInBackground: false,
    poolIds,
  })

  const [myPools, allPools] = useSplitTokens({ liquidity, supportedTokens })

  const { symbol: baseTokenSymbol } = useBaseTokenInfo() || {}

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
              <SectionTitle>My Pools</SectionTitle>
              <StyledDivForPoolsGrid>
                {myPools.map(({ liquidityInfo, tokenInfo }, key) => (
                  <PoolCard
                    key={key}
                    tokenASymbol={baseTokenSymbol}
                    poolId={tokenInfo.pool_id}
                    tokenBSymbol={tokenInfo.symbol}
                    myLiquidity={liquidityInfo.myLiquidity}
                    totalLiquidity={liquidityInfo.totalLiquidity}
                  />
                ))}
              </StyledDivForPoolsGrid>
              {Boolean(allPools?.length) && (
                <SectionTitle variant="all">All pools</SectionTitle>
              )}
            </>
          )}
          <StyledDivForPoolsGrid>
            {allPools?.map(({ liquidityInfo, tokenInfo }, key) => (
              <PoolCard
                key={key}
                tokenASymbol={baseTokenSymbol}
                poolId={tokenInfo.pool_id}
                tokenBSymbol={tokenInfo.symbol}
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

    return [tokensCollection, poolIdsCollection]
  }, [tokenList])
}

const useSplitTokens = ({ liquidity, supportedTokens }) => {
  return useMemo(() => {
    if (!liquidity?.length) return []
    const pools = [[], []]
    liquidity.forEach((liquidityInfo, index) => {
      const poolIndex = liquidityInfo.myLiquidity.coins > 0 ? 0 : 1
      pools[poolIndex].push({
        liquidityInfo,
        tokenInfo: supportedTokens[index],
      })
    })

    return pools
  }, [liquidity, supportedTokens])
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

const SectionTitle = ({ variant = 'my', children }) => {
  return (
    <Text
      variant="primary"
      css={{
        paddingBottom: '$11',
        paddingTop: variant === 'all' ? '$19' : '0px',
      }}
    >
      {children}
    </Text>
  )
}
