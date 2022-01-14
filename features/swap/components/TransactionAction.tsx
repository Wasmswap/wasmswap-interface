import { styled } from 'components/theme'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { walletState, WalletStatusType } from '../../../state/atoms/walletAtoms'
import { useConnectWallet } from '../../../hooks/useConnectWallet'
import { useTokenSwap } from '../hooks/useTokenSwap'
import { Spinner } from '../../../components/Spinner'
import { SlippageSelector } from './SlippageSelector'
import { NETWORK_FEE } from '../../../util/constants'
import { useTokenBalance } from '../../../hooks/useTokenBalance'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
}

export const TransactionAction = ({
  isPriceLoading,
  tokenToTokenPrice,
}: TransactionTipsProps) => {
  const [requestedSwap, setRequestedSwap] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)
  const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol)

  /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap({
      tokenASymbol: tokenA?.tokenSymbol,
      tokenBSymbol: tokenB?.tokenSymbol,
      tokenAmount: tokenA?.amount,
      tokenToTokenPrice: tokenToTokenPrice || 0,
    })

  /* proceed with the swap only if the price is loaded */

  useEffect(() => {
    const shouldTriggerTransaction =
      !isPriceLoading && !isExecutingTransaction && requestedSwap
    if (shouldTriggerTransaction) {
      handleSwap()
      setRequestedSwap(false)
    }
  }, [isPriceLoading, isExecutingTransaction, requestedSwap, handleSwap])

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedSwap(true)
    }

    connectWallet(null)
  }

  const shouldDisableSubmissionButton =
    isExecutingTransaction ||
    !tokenB.tokenSymbol ||
    !tokenA.tokenSymbol ||
    (status === WalletStatusType.connected && tokenA.amount <= 0) ||
    tokenA?.amount > tokenABalance

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo kind="slippage">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo kind="fees">
          <Text variant="legend">Swap fee ({NETWORK_FEE * 100}%)</Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      <Button
        variant="primary"
        size="large"
        disabled={shouldDisableSubmissionButton}
        onClick={
          !isExecutingTransaction && !isPriceLoading
            ? handleSwapButtonClick
            : undefined
        }
      >
        {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
      </Button>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 150px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  borderRadius: 8,
})

const StyledDivColumnForInfo = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      slippage: {
        backgroundColor: 'transparent',
        minWidth: '140px',
        borderRadius: '$4 0 0 $4',
        borderRight: '1px solid $borderColors$default',
      },
      fees: {
        backgroundColor: '$colors$dark10',
        flex: 1,
        padding: 'calc($space$8 - $space$1 / 1.5) $space$12',
        borderRadius: '0 $2 $2 0',
      },
    },
  },
})
