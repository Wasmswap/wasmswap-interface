import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'
import { PoolsContent } from '../components/Pools/PoolsContent'
import { tabsConfig, tabValueState } from '../state/atoms/tabAtoms'
import { useRecoilState } from 'recoil'
import { SwapFormSegmentedController } from '../components/SwapForm/SwapFormStyles'
import styled from 'styled-components'

export default function Home() {
  const [currentTab, setCurrentTab] = useRecoilState(tabValueState)

  return (
    <>
      <StyledSpacer />
      <SwapFormSegmentedController
        tabs={tabsConfig}
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setCurrentTab(tab)
        }}
      />
      <SwapFormFrame $expanded={currentTab === 'pools'}>
        {currentTab === 'swap' ? <SwapFormContent /> : <PoolsContent />}
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Wasmswap is currently in beta and operating on the Juno testnet. Keplr
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
