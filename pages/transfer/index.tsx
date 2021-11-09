import React, { useState } from 'react'
import { Disclaimer } from 'components/SwapForm/Disclaimer'
import { SwapFormFrame } from 'components/SwapForm/SwapFormFrame'
import { Text } from 'components/Text'
import styled from 'styled-components'
import { Header } from './Header'
import { AssetCard } from './AssetCard'
import { useTokenInfo } from '../../hooks/useTokenInfo'
import { spaces } from '../../util/constants'
import { TransferDialog } from '../../components/TransferDialog'

export default function Transfer() {
  const tokenInfo = useTokenInfo('JUNO')

  const [isTransferDialogShowing, setTransferDialogShowing] = useState(false)

  const openTransferDialog = () => setTransferDialogShowing(true)

  return (
    <>
      <TransferDialog
        isShowing={isTransferDialogShowing}
        onRequestClose={() => setTransferDialogShowing(false)}
      />

      <StyledSpacer />
      <SwapFormFrame $expanded={true}>
        <StyledWrapper>
          <Header title="IBC Transfer">
            Easily and quickly initiate payments in between interchain wallets.
          </Header>
          <StyledSubtitle
            paddingBottom={spaces[24]}
            type="title"
            variant="bold"
          >
            My assets
          </StyledSubtitle>
          <StyledGrid>
            <AssetCard
              tokenInfo={tokenInfo}
              onActionClick={openTransferDialog}
            />
            <AssetCard
              tokenInfo={tokenInfo}
              onActionClick={openTransferDialog}
            />
          </StyledGrid>
        </StyledWrapper>
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Junoswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </>
  )
}

const StyledWrapper = styled.section`
  padding-bottom: 34px;
`

const StyledSubtitle = styled(Text)`
  font-size: 24px;
  line-height: 35px;
`

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 14px;
`

const StyledSpacer = styled.div`
  height: calc(13.5vh - 84px);
  max-height: 400px;
  width: 100%;
`
