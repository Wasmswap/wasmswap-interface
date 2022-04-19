import { AppLayout, PageHeader } from 'components'
import { TokenSwapModule } from 'features/swap'
import { styled } from 'junoblocks'
import React from 'react'

export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader
          title="Swap"
          subtitle="Swap between your favorite assets on Juno."
        />
        <TokenSwapModule />
      </StyledContainer>
    </AppLayout>
  )
}

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
