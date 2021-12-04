import React from 'react'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'
import { AppLayout } from '../components/Layout/AppLayout'

export default function Home() {
  return (
    <AppLayout>
      <SwapFormFrame $expanded={false}>
        <SwapFormContent />
      </SwapFormFrame>
    </AppLayout>
  )
}
