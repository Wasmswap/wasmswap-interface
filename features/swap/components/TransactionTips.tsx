import { IconWrapper } from '../../../components/IconWrapper'
import { Exchange } from '../../../icons/Exchange'
import { Text } from '../../../components/Text'
import React, { useState } from 'react'
import { styled } from '@stitches/react'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  protectAgainstNaN,
} from '../../../util/conversion'
import { usePersistance } from '../../../hooks/usePersistance'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from '../swapAtoms'
import { useTokenToTokenPrice } from '../hooks/useTokenToTokenPrice'

type TransactionTipsProps = {
  isPriceLoading: boolean
  tokenAPrice: number
  tokenToTokenPrice: number
  onTokenSwaps: () => void
  disabled?: boolean
}

export const TransactionTips = ({
  tokenAPrice,
  isPriceLoading,
  tokenToTokenPrice,
  onTokenSwaps,
  disabled,
}: TransactionTipsProps) => {
  const [swappedPosition, setSwappedPositions] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
    useTxRates({
      tokenA,
      tokenB,
      tokenAPrice,
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
            {dollarValueFormatterWithDecimals(
              protectAgainstNaN(conversionRateInDollar),
              true
            )}
          </Text>
        )}
      </StyledDivForRateWrapper>

      <Text type="microscopic" variant="bold" color="secondaryText">
        ${dollarValueFormatterWithDecimals(dollarValue, true)}
      </Text>
    </StyledDivForWrapper>
  )
}

const useTxRates = ({
  tokenA,
  tokenB,
  tokenAPrice,
  tokenToTokenPrice,
  isLoading,
}) => {
  const oneTokenPrice = useOneTokenPrice()
  const dollarValue = (tokenAPrice || 0) * (tokenA.amount || 0)

  const shouldShowRates =
    (Boolean(
      tokenA?.tokenSymbol && tokenB?.tokenSymbol && tokenToTokenPrice > 0
    ) &&
      Boolean(
        typeof tokenA.amount === 'number' &&
          typeof tokenToTokenPrice === 'number'
      )) ||
    (oneTokenPrice && tokenA.amount === 0)

  function calculateConversionRate() {
    if (tokenA.amount === 0) {
      return 1 / oneTokenPrice
    }

    return tokenA.amount / tokenToTokenPrice
  }

  const conversionRate = usePersistance(
    isLoading || !shouldShowRates ? undefined : calculateConversionRate()
  )

  function calculateConversionRateInDollar() {
    if (tokenA.amount === 0) {
      return conversionRate * tokenAPrice
    }

    return (conversionRate * dollarValue) / tokenA.amount
  }

  const conversionRateInDollar = usePersistance(
    isLoading || !shouldShowRates
      ? undefined
      : calculateConversionRateInDollar()
  )

  return {
    isShowing: shouldShowRates,
    conversionRate,
    conversionRateInDollar,
    dollarValue,
  }
}

const useOneTokenPrice = () => {
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)
  const [currentTokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: 1,
  })

  return usePersistance(isPriceLoading ? undefined : currentTokenPrice)
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
