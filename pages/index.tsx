import React from 'react'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'
import styled from 'styled-components'

export default function Home() {
  return (
    <>
      <StyledSpacer />
      <SwapFormFrame $expanded={false}>
        <SwapFormContent />
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Junoswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </>
  )
}

const StyledSpacer = styled.div`
  height: calc(13.5vh - 84px);
  max-height: 400px;
  width: 100%;
`
