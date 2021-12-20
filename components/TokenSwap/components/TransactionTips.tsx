import { IconWrapper } from '../../IconWrapper'
import { Exchange } from '../../../icons/Exchange'
import { Text } from '../../Text'
import React, { useState } from 'react'
import { styled } from '@stitches/react'
import { useConstant } from '@reach/utils'
import {
  createBalanceFormatter,
  formatTokenBalance,
} from '../../../util/conversion'
import { usePersistance } from '../../../hooks/usePersistance'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from '../tokenSwapAtom'

type TransactionTipsProps = {
  dollarValue: number
  onTokenSwaps: () => void
}

export const TransactionTips = ({
  dollarValue,
  isPriceLoading,
  tokenToTokenPrice,
  onTokenSwaps,
}: TransactionTipsProps) => {
  const formatter = useConstant(() =>
    createBalanceFormatter({ style: 'currency', currency: 'USD' })
  )
  const [swappedPosition, setSwappedPositions] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  const canShowRate =
    Boolean(
      tokenA?.tokenSymbol && tokenB?.tokenSymbol && tokenToTokenPrice > 0
    ) &&
    Boolean(
      typeof tokenA.amount === 'number' && typeof tokenToTokenPrice === 'number'
    )

  const conversionRate = canShowRate ? tokenA.amount / tokenToTokenPrice : 0
  const persistConversionRate = usePersistance(
    isPriceLoading ? undefined : conversionRate
  )

  const conversionRateInDollar = (tokenToTokenPrice / tokenA.amount) * 10
  const persistConversionRateInDollar = usePersistance(
    isPriceLoading ? undefined : conversionRateInDollar
  )

  return (
    <StyledDivForWrapper>
      <StyledDivForRateWrapper>
        <StyledIconWrapper
          type="button"
          width="24px"
          height="20px"
          icon={<Exchange />}
          flipped={swappedPosition}
          onClick={() => {
            setSwappedPositions(!swappedPosition)
            onTokenSwaps()
          }}
        />
        {canShowRate && (
          <Text type="microscopic" variant="bold" color="disabled" wrap="pre">
            1 {tokenA.tokenSymbol} ≈{' '}
            {formatTokenBalance(
              isPriceLoading ? persistConversionRate : conversionRate
            )}{' '}
            {tokenB.tokenSymbol}
            {' ≈ '}
            {formatter(
              isPriceLoading
                ? persistConversionRateInDollar
                : conversionRateInDollar,
              true
            )}
          </Text>
        )}
      </StyledDivForRateWrapper>

      <Text type="microscopic" variant="bold" color="secondaryText">
        {formatter(dollarValue, true)}
      </Text>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '15px 31px 15px 29px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  justifyContent: 'space-between',
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
