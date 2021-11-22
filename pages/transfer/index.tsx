import React, { useEffect, useReducer } from 'react'
import { SwapFormFrame } from 'components/SwapForm/SwapFormFrame'
import { Text } from 'components/Text'
import styled from 'styled-components'
import { Header } from './Header'
import { AssetCard } from './AssetCard'
import { spaces } from '../../util/constants'
import { TransferDialog } from '../../components/TransferDialog'
import { useConnectIBCWallet } from '../../hooks/useConnectIBCWallet'
import { toast } from 'react-toastify'

export default function Transfer() {
  const [
    { transactionKind, isTransferDialogShowing, selectedToken },
    updateState,
  ] = useReducer((store, updatedStore) => ({ ...store, ...updatedStore }), {
    transactionKind: 'deposit',
    isTransferDialogShowing: false,
    selectedToken: 'ATOM',
  })

  function handleAssetCardActionClick({ actionType, tokenSymbol }) {
    updateState({
      transactionKind: actionType,
      selectedToken: tokenSymbol,
      isTransferDialogShowing: true,
    })
  }

  function handleTransferDialogClose() {
    updateState({ isTransferDialogShowing: false })
  }

  const { mutate: connectWallet } = useConnectIBCWallet({
    onError(error) {
      toast.error(
        `Couldn't connect to your wallet to retrieve the address for ${selectedToken}: ${error}`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      )
    },
  })
  useEffect(() => {
    // connect wallet as soon as a token is selected
    if (selectedToken) {
      connectWallet(selectedToken)
    }
  }, [connectWallet, selectedToken])

  return (
    <>
      <TransferDialog
        tokenSymbol={selectedToken}
        transactionKind={transactionKind}
        isShowing={isTransferDialogShowing}
        onRequestClose={handleTransferDialogClose}
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
