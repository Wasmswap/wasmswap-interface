import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useIBCTokenBalance } from 'hooks/useIBCTokenBalance'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useTokenBalance } from 'hooks/useTokenBalance'
import {
  Button,
  Dialog,
  DialogButtons,
  DialogContent,
  DialogDivider,
  DialogHeader,
  Error,
  IconWrapper,
  Spinner,
  Text,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

import { AmountInput } from './AmountInput'
import { AssetSelector } from './AssetSelector'
import { TransactionKind } from './types'
import { useTransferAssetMutation } from './useTransferAssetMutation'
import { AppWalletInfo, KeplrWalletInfo } from './WalletInfo'

type TransferDialogProps = {
  tokenSymbol: string
  transactionKind: TransactionKind
  isShowing: boolean
  onTokenSelect: (tokenSymbol: string) => void
  onRequestClose: () => void
}

export const TransferDialog = ({
  tokenSymbol,
  transactionKind,
  isShowing,
  onRequestClose,
  onTokenSelect,
}: TransferDialogProps) => {
  const tokenInfo = useIBCAssetInfo(tokenSymbol)
  const deposit_gas_fee = tokenInfo.deposit_gas_fee
    ? tokenInfo.deposit_gas_fee
    : 0.01

  const { balance: externalIbcAssetBalance } = useIBCTokenBalance(tokenSymbol)
  const { balance: nativeAssetBalance } = useTokenBalance(tokenSymbol)

  const [tokenAmount, setTokenAmount] = useState(0)
  const refetchQueries = useRefetchQueries(['tokenBalance', 'ibcTokenBalance'])

  const { isLoading, mutate: mutateTransferAsset } = useTransferAssetMutation({
    transactionKind,
    tokenAmount,
    tokenInfo,

    onSuccess() {
      // reset cache
      refetchQueries()

      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Valid />} color="valid" />}
          title={`${tokenSymbol} ${
            transactionKind === 'deposit' ? 'deposit' : 'withdrawal'
          } successfully initiated`}
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

  const WalletInfoPerformingActionFrom =
    transactionKind === 'deposit' ? KeplrWalletInfo : AppWalletInfo
  const WalletInfoPerformingActionAgainst =
    transactionKind === 'withdraw' ? KeplrWalletInfo : AppWalletInfo

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom="$13">
        <Text variant="header">{capitalizedTransactionType}</Text>
      </DialogHeader>
      <DialogContent>
        <WalletInfoPerformingActionFrom css={{ paddingBottom: '$12' }} />
        <AssetSelector
          activeTokenSymbol={tokenSymbol}
          onTokenSymbolSelect={onTokenSelect}
          fetchingBalancesAgainstChain={
            transactionKind === 'deposit' ? 'ibc' : 'native'
          }
        />
      </DialogContent>
      <DialogDivider offsetY="$10" />
      <DialogContent>
        <Text variant="primary" css={{ paddingBottom: '$6' }}>
          Amount
        </Text>
        <AmountInput
          maxApplicableAmount={
            transactionKind === 'deposit'
              ? Math.max(externalIbcAssetBalance - deposit_gas_fee, 0)
              : nativeAssetBalance
          }
          amount={tokenAmount}
          onAmountChange={setTokenAmount}
        />
      </DialogContent>
      <DialogDivider offsetY="$10" />
      <DialogContent css={{ paddingBottom: '$8' }}>
        <WalletInfoPerformingActionAgainst depositing={true} />
      </DialogContent>
      <DialogButtons
        cancellationButton={
          <Button onClick={onRequestClose} variant="secondary">
            Cancel
          </Button>
        }
        confirmationButton={
          <Button
            disabled={
              transactionKind === 'deposit'
                ? externalIbcAssetBalance <= 0
                : nativeAssetBalance <= 0
            }
            onClick={() => mutateTransferAsset(null)}
            variant="primary"
          >
            {isLoading ? <Spinner instant={true} size={16} /> : 'Transfer'}
          </Button>
        }
      />
    </Dialog>
  )
}
