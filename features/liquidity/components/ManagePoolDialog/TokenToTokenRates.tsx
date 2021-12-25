import { styled } from '@stitches/react'
import { useTxRates } from 'features/swap/hooks/useTxRates'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'
import { Text } from 'components/Text'

export const TokenToTokenRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  oneTokenToTokenPrice,
  isLoading,
}) => {
  const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
    useTxRates({
      tokenASymbol,
      tokenBSymbol,
      tokenAAmount,
      tokenToTokenPrice: oneTokenToTokenPrice * tokenAAmount,
      isLoading,
    })

  return (
    <StyledDivForGrid active={isShowing}>
      <Text type="microscopic" variant="bold" color="disabled" wrap="pre">
        1 {tokenASymbol} ≈ {formatTokenBalance(conversionRate)} {tokenBSymbol}
        {' ≈ '}${dollarValueFormatterWithDecimals(conversionRateInDollar, true)}
      </Text>
      <Text type="microscopic" variant="bold" color="disabled">
        ${dollarValueFormatterWithDecimals(dollarValue * 2, true)}
      </Text>
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  variants: {
    active: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
})
