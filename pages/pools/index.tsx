import React from 'react'
import styled from 'styled-components'
import { AppLayout } from '../../components/Layout/AppLayout'
import TokenList from '../../public/token_list.json'
import { PoolCard } from '../../components/Pools/PoolCard'
import { PageHeader } from '../../components/Layout/PageHeader'
import { getBaseToken } from 'hooks/useTokenInfo'

export default function Pools() {
  return (
    <AppLayout>
      <PageHeader
        title="Pools"
        subtitle="Provide liquidity to the market by adding assets to the pools and
        receive swap fees from each trade."
      />

      <StyledDivForPoolsGrid>
        {TokenList.tokens
          .filter((x) => x.symbol != getBaseToken().symbol)
          .map((token, key) => (
            <PoolCard
              key={key}
              poolId={token.pool_id}
              tokenASymbol={getBaseToken().symbol}
              tokenBSymbol={token.symbol}
            />
          ))}
      </StyledDivForPoolsGrid>
    </AppLayout>
  )
}

const StyledDivForPoolsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 20px;
  row-gap: 24px;
  padding-bottom: 24px;
`
