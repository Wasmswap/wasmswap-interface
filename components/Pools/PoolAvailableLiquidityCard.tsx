import { styled } from '@stitches/react'
import { Text } from '../Text'
import { Button } from '../Button'
import { formatTokenBalance } from '../../util/conversion'

export const PoolAvailableLiquidityCard = ({
  onButtonClick,
  myLiquidity,
  totalLiquidity,
  myToken1Reserve,
  myToken2Reserve,
  token1DollarValue,
}) => {
  return (
    <StyledElementForCardLayout kind="wrapper">
      <StyledElementForCardLayout kind="content" name="liquidity">
        <Text
          type="caption"
          color="secondaryText"
          variant="light"
          paddingBottom="9px"
        >
          {typeof myLiquidity === 'number'
            ? `You own ${formatTokenBalance(
                myLiquidity / totalLiquidity * 100
              )}% of the pool`
            : 'Your liquidity'}
        </Text>
        <StyledTextForAmount>${(myToken1Reserve / 1000000) * token1DollarValue * 2 || '0.00'}</StyledTextForAmount>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="/crab.png" />
            <Text color="bodyText" type="microscopic">
              {myToken1Reserve / 1000000} juno
            </Text>
          </StyledElementForTokens>
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="/crab.png" />
            <Text color="bodyText" type="microscopic">
              {myToken2Reserve / 1000000} atom
            </Text>
          </StyledElementForTokens>
        </StyledElementForTokens>
        <StyledButton onClick={onButtonClick}>
          Add / Remove liquidity
        </StyledButton>
      </StyledElementForCardLayout>
    </StyledElementForCardLayout>
  )
}

const StyledElementForCardLayout = styled('div', {
  variants: {
    kind: {
      wrapper: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        padding: '20px 0 22px',
        borderRadius: '8px',
      },
      content: {
        padding: '0 24px',
        '&:not(&:last-child)': {
          borderBottom: '1px solid rgba(25, 29, 32, 0.1)',
        },
      },
    },
    name: {
      liquidity: {
        padding: '0 24px 26px',
      },
    },
  },
})

const StyledTextForAmount = styled('p', {
  fontSize: '30px',
  lineHeight: '24px',
  fontWeight: 600,
})

const StyledElementForTokens = styled('div', {
  display: 'grid',

  variants: {
    kind: {
      element: {
        gridTemplateColumns: '20px auto',
        alignItems: 'center',
        columnGap: '6px',
      },
      wrapper: {
        rowGap: '16px',
        paddingTop: '22px',
        paddingBottom: '24px',
      },
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledButton = styled(Button, {
  width: '100% !important',
})
