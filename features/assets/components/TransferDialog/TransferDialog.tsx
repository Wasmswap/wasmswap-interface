import { toast } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { Spinner } from 'components/Spinner'
import React, { useState } from 'react'
import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useTransferAssetMutation } from './useTransferAssetMutation'
import { TransactionKind } from './types'
import { Toast } from 'components/Toast'
import { IconWrapper } from 'components/IconWrapper'
import { Valid } from 'icons/Valid'
import { Error } from 'icons/Error'
import { UpRightArrow } from 'icons/UpRightArrow'
import {
  DialogButtons,
  DialogContent,
  DialogDivider,
  DialogHeader,
  DialogV2,
} from 'components/DialogV2'
import { AppWalletInfo, KeplrWalletInfo } from './WalletInfo'
import { AssetSelector } from './AssetSelector'
import { AmountInput } from './AmountInput'

type TransferDialogProps = {
  tokenSymbol: string
  transactionKind: TransactionKind
  isShowing: boolean
  onRequestClose: () => void
}

export const TransferDialog = ({
  tokenSymbol,
  transactionKind,
  isShowing,
  onRequestClose,
}: TransferDialogProps) => {
  const tokenInfo = useIBCAssetInfo(tokenSymbol)

  const [tokenAmount, setTokenAmount] = useState(0)

  const queryClient = useQueryClient()

  const { isLoading, mutate: mutateTransferAsset } = useTransferAssetMutation({
    transactionKind,
    tokenAmount,
    tokenInfo,

    onSuccess() {
      // reset cache
      queryClient
        .resetQueries(['tokenBalance', 'ibcTokenBalance'])
        .then((...args) => {
          console.log('Refetched queries', ...args)
        })

      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Valid />} color="valid" />}
          title={`${
            transactionKind === 'deposit' ? 'Deposited' : 'Withdrawn'
          } ${tokenInfo.name} Successfully`}
          onClose={() => toast.dismiss(t.id)}
        />
      ))

      // close modal
      requestAnimationFrame(onRequestClose)
    },
    onError(error) {
      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Error />} color="error" />}
          title={`Couldn't ${
            transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'
          } the asset`}
          body={(error as any)?.message ?? error?.toString()}
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

  const capitalizedTransactionType =
    transactionKind === 'deposit' ? 'Deposit' : 'Withdraw'

  return (
    <DialogV2 isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom="$13">
        <Text variant="header">{capitalizedTransactionType}</Text>
      </DialogHeader>
      <DialogContent>
        <KeplrWalletInfo css={{ paddingBottom: '$12' }} />
        <AssetSelector tokenSymbol={tokenSymbol} />
      </DialogContent>
      <DialogDivider offsetY="$10" />
      <DialogContent>
        <Text variant="primary" css={{ paddingBottom: '$6' }}>
          Amount
        </Text>
        <AmountInput
          tokenSymbol={tokenSymbol}
          amount={tokenAmount}
          onAmountChange={setTokenAmount}
        />
      </DialogContent>
      <DialogDivider offsetY="$10" />
      <DialogContent css={{ paddingBottom: '$8' }}>
        <AppWalletInfo />
      </DialogContent>
      <DialogButtons>
        <Button onClick={onRequestClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={() => mutateTransferAsset(null)} variant="primary">
          {isLoading ? <Spinner instant={true} size={16} /> : 'Transfer'}
        </Button>
      </DialogButtons>
    </DialogV2>
  )
}
