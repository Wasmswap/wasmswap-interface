import { IconWrapper } from '../../../components/IconWrapper'
import { Exchange } from '../../../icons/Exchange'
import { Text } from '../../../components/Text'
import React, { useState } from 'react'
import { styled } from '@stitches/react'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from '../../../util/conversion'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from '../swapAtoms'
import { useTxRates } from '../hooks/useTxRates'

type TransactionTipsProps = {
  isPriceLoading: boolean
  tokenToTokenPrice: number
  onTokenSwaps: () => void
  disabled?: boolean
}

export const TransactionTips = ({
  isPriceLoading,
  tokenToTokenPrice,
  onTokenSwaps,
  disabled,
}: TransactionTipsProps) => {
  const [swappedPosition, setSwappedPositions] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
    useTxRates({
      tokenASymbol: tokenA?.tokenSymbol,
      tokenBSymbol: tokenB?.tokenSymbol,
      tokenAAmount: tokenA?.amount,
      tokenToTokenPrice,
      isLoading: isPriceLoading,
    })

  return (
    <StyledDivForWrapper>
      <StyledDivForRateWrapper>
        <StyledIconWrapper
          type="button"
          size="20px"
          color="tertiaryIcon"
          icon={<Exchange />}
          flipped={swappedPosition}
          onClick={
            !disabled
              ? () => {
                  setSwappedPositions(!swappedPosition)
                  onTokenSwaps()
                }
              : undefined
          }
        />
        {isShowing && (
          <Text type="microscopic" variant="bold" color="disabled" wrap="pre">
            1 {tokenA.tokenSymbol} ≈ {formatTokenBalance(conversionRate)}{' '}
            {tokenB.tokenSymbol}
            {' ≈ '}$
            {dollarValueFormatterWithDecimals(conversionRateInDollar, true)}
          </Text>
        )}
      </StyledDivForRateWrapper>

      <Text type="microscopic" variant="bold" color="secondaryText">
        ${dollarValueFormatterWithDecimals(dollarValue, true)}
      </Text>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '15px 31px 15px 29px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'right',
  borderTop: '1px solid rgba(25, 29, 32, 0.1)',
  borderBottom: '1px solid rgba(25, 29, 32, 0.1)',
})

const StyledDivForRateWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '24px 1fr',
  alignItems: 'center',
  textAlign: 'left',
  columnGap: '16px',
})

const StyledIconWrapper = styled(IconWrapper, {
  variants: {
    flipped: {
      true: {
        transform: 'rotateX(180deg)',
      },
      false: {
        transform: 'rotateX(0deg)',
      },
    },
  },
})
