import React, { useMemo } from 'react'
import styled from 'styled-components'
import { AppLayout } from 'components/Layout/AppLayout'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { PoolCard } from 'features/liquidity/components/PoolCard'
import { PageHeader } from 'components/Layout/PageHeader'
import { useMultiplePoolsLiquidity } from 'hooks/usePoolLiquidity'
import { Text } from 'components/Text'
import { Spinner } from 'components/Spinner'
import { useTokenList } from 'hooks/useTokenList'

export default function Pools() {
  const [tokenList] = useTokenList()
  const [supportedTokens, poolIds] = useMemo(() => {
    const tokensCollection =
      tokenList?.tokens.filter(({ swap_address }) => Boolean(swap_address)) ??
      []

    const poolIdsCollection = tokensCollection
      .map(({ pool_id }) => pool_id)
      .filter(Boolean)

    return [tokensCollection, poolIdsCollection]
  }, [tokenList])

  const [liquidity, isLoading] = useMultiplePoolsLiquidity({
    poolIds,
  })

  const [myPools, allPools] = useMemo(() => {
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
          <StyledDivForFullSpace>
            <Spinner size={32} color="black" />
          </StyledDivForFullSpace>
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

const StyledDivForFullSpace = styled.div`
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`

const rowGap = '24px'

const StyledDivForPoolsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, calc(50% - ${rowGap})) minmax(
      auto,
      calc(50%)
    );
  column-gap: 20px;
  row-gap: ${rowGap};
`

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
