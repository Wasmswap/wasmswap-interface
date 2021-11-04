import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Disclaimer } from 'components/SwapForm/Disclaimer'
import { SwapFormFrame } from 'components/SwapForm/SwapFormFrame'
import { Text } from 'components/Text'
import styled from 'styled-components'
import { Header } from './Header'
import { AssetCard } from './AssetCard'
import { useTokenInfo } from '../../hooks/useTokenInfo'
import { spaces } from '../../util/constants'

export default function Transfer() {
  const tokenInfo = useTokenInfo('JUNO')
  return (
    <>
      <StyledSpacer />
      <SwapFormFrame $expanded={true}>
        <Header title="IBC Transfer">
          Easily and quickly initiate payments in between interchain wallets.
        </Header>
        <Text paddingBottom={spaces[24]} type="title" variant="bold">
          My assets
        </Text>
        <div style={{ maxWidth: 280 }}>
          <AssetCard tokenInfo={tokenInfo} balance={999} />
        </div>
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
