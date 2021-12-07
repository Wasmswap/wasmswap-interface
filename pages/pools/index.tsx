import React from 'react'
import { Disclaimer } from 'components/SwapForm/Disclaimer'
import { SwapFormFrame } from 'components/SwapForm/SwapFormFrame'
import { PoolsContent } from 'components/Pools/PoolsContent'
import styled from 'styled-components'
import { AppLayout } from '../../components/Layout/AppLayout'

export default function Pools() {
  return (
    <AppLayout>
      <StyledSpacer />
      <SwapFormFrame $expanded>
        <PoolsContent />
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Junoswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </AppLayout>
  )
}

const StyledSpacer = styled.div`
  height: calc(13.5vh - 84px);
  max-height: 400px;
  width: 100%;
`
