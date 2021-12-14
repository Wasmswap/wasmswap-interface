import React from 'react'
import styled from 'styled-components'
import { AppLayout } from '../../components/Layout/AppLayout'
import TokenList from '../../public/token_list.json'
import { PoolCard } from '../../components/Pools/PoolCard'
import { PageHeader } from '../../components/Layout/PageHeader'

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
          .filter((x) => x.token_address)
          .map((token, key) => (
            <PoolCard
              key={key}
              tokenASymbol="JUNO"
              tokenBSymbol={token.symbol}
              tokenAddress={token.token_address}
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
