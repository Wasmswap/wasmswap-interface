import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import { TokenSwap } from '../components/TokenSwap'
import { PageHeader } from '../components/Layout/PageHeader'

export default function Home() {
  return (
    <AppLayout>
      <PageHeader
        title="Pools"
        subtitle="Provide liquidity to the market by adding assets to the pools and
        receive swap fees from each trade."
      />
      <TokenSwap />
    </AppLayout>
  )
}
