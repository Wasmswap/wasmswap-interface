import React, { useRef, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { SwapFormSegmentedController } from '../components/SwapForm/SwapFormStyles'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'

export default function Home() {
  const segmentedControllerTabs = useRef([
    { label: 'Swap', value: 'swap' },
    { label: 'Pools', value: 'pools' },
  ]).current

  const [currentTab, setTab] = useState(segmentedControllerTabs[0].value)

  return (
    <div>
      <SwapFormSegmentedController
        tabs={segmentedControllerTabs}
        currentTab={currentTab}
        onChangeTab={(tab) => setTab(tab)}
      />
      <SwapFormFrame $expanded={currentTab === 'pools'}>
        <SwapFormContent />
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Wasmswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </div>
  )
}
