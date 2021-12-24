import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import { TokenSwap } from '../components/TokenSwap'
import { PageHeader } from '../components/Layout/PageHeader'

export default function Home() {
  return (
    <AppLayout>
      <PageHeader
        title="Swap"
        subtitle="Swap between your favorite assets on Juno."
      />
      <TokenSwap />
    </AppLayout>
  )
}
