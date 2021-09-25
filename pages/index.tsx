import React, { useRef, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { SwapFormSegmentedController } from '../components/SwapForm/SwapFormStyles'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'
import { PoolsContent } from '../components/Pools/PoolsContent'
import { animated } from '@react-spring/web'
import { useSpring } from '@react-spring/three'

export default function Home() {
  const segmentedControllerTabs = useRef([
    { label: 'Swap', value: 'swap' },
    { label: 'Pools', value: 'pools' },
  ]).current

  const [currentTab, setTab] = useState(segmentedControllerTabs[0].value)

  const [isChangingTabs, setIsSwitchingTabs] = useState(false)
  const [mostRecentTab, setMostRecentTab] = useState(currentTab)

  const { opacity } = useSpring({
    opacity: isChangingTabs ? 0 : 1,
    onRest() {
      setIsSwitchingTabs(false)
      setMostRecentTab(currentTab)
    },
  })

  return (
    <div>
      <SwapFormSegmentedController
        tabs={segmentedControllerTabs}
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setIsSwitchingTabs(true)
          setTab(tab)
        }}
      />
      <SwapFormFrame $expanded={currentTab === 'pools'}>
        <animated.div style={{ opacity }}>
          {mostRecentTab === 'swap' ? <SwapFormContent /> : <PoolsContent />}
        </animated.div>
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Wasmswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </div>
  )
}
