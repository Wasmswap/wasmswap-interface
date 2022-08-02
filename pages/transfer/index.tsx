import { useWalletManager } from '@noahsaso/cosmodal'
import { AppLayout, PageHeader } from 'components'
import { AssetsList, TransferDialog } from 'features/assets'
import { useConnectIBCWallet } from 'hooks/useConnectIBCWallet'
import {
  Button,
  Error,
  IconWrapper,
  styled,
  Toast,
  UpRightArrow,
} from 'junoblocks'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-hot-toast'

export default function Transfer() {
  const [
    { transactionKind, isTransferDialogShowing, selectedToken },
    updateState,
  ] = useReducer((store, updatedStore) => ({ ...store, ...updatedStore }), {
    transactionKind: 'deposit',
    isTransferDialogShowing: false,
    selectedToken: null,
  })

  function handleAssetCardActionClick({ actionType, tokenSymbol }) {
    updateState({
      transactionKind: actionType,
      selectedToken: tokenSymbol,
      isTransferDialogShowing: true,
    })
  }

  function handleUpdateSelectedToken(tokenSymbol: string) {
    updateState({
      selectedToken: tokenSymbol,
    })
  }

  function handleTransferDialogClose() {
    updateState({ isTransferDialogShowing: false })
  }

  const { mutate: connectExternalWallet } = useConnectIBCWallet(selectedToken, {
    onError(error) {
      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Error />} color="error" />}
          title={`Cannot get wallet address for ${selectedToken}`}
          body={error?.toString()}
          buttons={
            <Button
              as="a"
              variant="ghost"
              href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
              target="__blank"
              iconRight={<UpRightArrow />}
            >
              Provide feedback
            </Button>
          }
          onClose={() => toast.dismiss(t.id)}
        />
      ))
    },
  })

  const { connect, connected } = useWalletManager()
  useEffect(() => {
    // connect wallet as soon as a token is selected
    const shouldConnectInternalWallet = selectedToken && !connected
    const shouldConnectExternallWallet = selectedToken && connected

    if (shouldConnectInternalWallet) {
      connect()
    }

    if (shouldConnectExternallWallet) {
      connectExternalWallet(null)
    }
  }, [connect, connectExternalWallet, connected, selectedToken])

  return (
    <>
      <AppLayout>
        <StyledWrapper>
          <PageHeader
            title="IBC Transfer"
            subtitle="Easily and quickly initiate payments across IBC."
          />
          <AssetsList onActionClick={handleAssetCardActionClick} />
        </StyledWrapper>
      </AppLayout>
      {selectedToken && (
        <TransferDialog
          tokenSymbol={selectedToken}
          transactionKind={transactionKind}
          isShowing={isTransferDialogShowing}
          onTokenSelect={handleUpdateSelectedToken}
          onRequestClose={handleTransferDialogClose}
        />
      )}
    </>
  )
}

const StyledWrapper = styled('section', {
  paddingBottom: '$17',
})
