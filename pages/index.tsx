import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { SwapFormContent } from '../components/SwapForm/SwapFormContent'
import { SwapFormFrame } from '../components/SwapForm/SwapFormFrame'
import { PoolsContent } from '../components/Pools/PoolsContent'
import { tabValueState } from '../state/atoms/tabAtoms'
import { useRecoilValue } from 'recoil'

export default function Home() {
  const currentTab = useRecoilValue(tabValueState)

  return (
    <div>
      <SwapFormFrame $expanded={currentTab === 'pools'}>
        {currentTab === 'swap' ? <SwapFormContent /> : <PoolsContent />}
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Wasmswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </div>
  )
}
