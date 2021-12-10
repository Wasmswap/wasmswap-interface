import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components'
import { TransferDialog } from '../../components/TransferDialog'
import { useConnectIBCWallet } from '../../hooks/useConnectIBCWallet'
import { toast } from 'react-toastify'
import { AppLayout } from '../../components/Layout/AppLayout'
import { PageHeader } from '../../components/Layout/PageHeader'
import { AssetsList } from './AssetsList'

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
      <AppLayout>
        <StyledWrapper>
          <PageHeader
            title="IBC Transfer"
            subtitle="Easily and quickly initiate payments in between interchain wallets."
          />

          <AssetsList onActionClick={handleAssetCardActionClick} />
        </StyledWrapper>
      </AppLayout>
      <TransferDialog
        tokenSymbol={selectedToken}
        transactionKind={transactionKind}
        isShowing={isTransferDialogShowing}
        onRequestClose={handleTransferDialogClose}
      />
    </>
  )
}

const StyledWrapper = styled.section`
  padding-bottom: 34px;
`
