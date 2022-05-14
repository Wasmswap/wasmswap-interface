import { usePriceForOneToken, useTxRates } from 'features/swap'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  styled,
  Text,
} from 'junoblocks'

export const TokenToTokenRates = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAAmount,
  isLoading,
}) => {
  const [oneTokenToTokenPrice] = usePriceForOneToken({
    tokenASymbol,
    tokenBSymbol,
  })

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
      <Text variant="caption" color="disabled" wrap={false}>
        1 {tokenASymbol} ≈ {formatTokenBalance(conversionRate)} {tokenBSymbol}
        {' ≈ '}$
        {dollarValueFormatterWithDecimals(conversionRateInDollar, {
          includeCommaSeparation: true,
        })}
      </Text>
      <Text variant="caption" color="disabled">
        $
        {dollarValueFormatterWithDecimals(dollarValue * 2, {
          includeCommaSeparation: true,
        })}
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
