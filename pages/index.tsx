import { AppLayout, PageHeader } from 'components'
import { TokenSwapModule } from 'features/swap'
import { styled } from 'junoblocks'
import React from 'react'
import { MigrationCard } from '../components/MigrationCard'

import { APP_NAME } from '../util/constants'

function getInitialTokenPairFromSearchParams() {
  const params = new URLSearchParams(location.search)
  const from = params.get('from')
  const to = params.get('to')
  return from || to ? ([from, to] as const) : undefined
}

export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <MigrationCard />
        <PageHeader
          title="Swap"
          subtitle={`Swap between your favorite assets on ${APP_NAME}.`}
        />
        <TokenSwapModule
          initialTokenPair={getInitialTokenPairFromSearchParams()}
        />
      </StyledContainer>
    </AppLayout>
  )
}

const StyledContainer = styled('div', {
  padding: '$4',
  margin: 0,
})
