import React, { useReducer } from 'react'
import { Disclaimer } from 'components/SwapForm/Disclaimer'
import { SwapFormFrame } from 'components/SwapForm/SwapFormFrame'
import { Text } from 'components/Text'
import styled from 'styled-components'
import { Header } from './Header'
import { AssetCard } from './AssetCard'
import { spaces } from '../../util/constants'
import { TransferDialog } from '../../components/TransferDialog'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useConnectIBCWallet } from 'hooks/useConnectIBCWallet'

export default function Transfer() {
  const [
    { transactionKind, isTransferDialogShowing, selectedToken },
    updateState,
  ] = useReducer((store, updatedStore) => ({ ...store, ...updatedStore }), {
    transactionKind: 'deposit',
    isTransferDialogShowing: false,
    selectedToken: 'ATOM',
  })

  function handleAssetCardActionClick({ actionType, tokenSymbol}) {
    updateState({
      transactionKind: actionType,
      selectedToken: tokenSymbol,
      isTransferDialogShowing: true,
    })
  }
  console.log(selectedToken)

  return (
    <>
      <TransferDialog
        tokenSymbol={selectedToken}
        transactionKind={transactionKind}
        isShowing={isTransferDialogShowing}
        onRequestClose={() => updateState({ isTransferDialogShowing: false })}
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
              tokenSymbol="ATOM"
              onActionClick={handleAssetCardActionClick}
            />
            <AssetCard
              tokenSymbol="UST"
              onActionClick={handleAssetCardActionClick}
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
