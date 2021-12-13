import { styled } from '@stitches/react'
import { Text } from '../Text'
import { Button } from '../Button'

export const PoolBondedLiquidityCard = () => {
  return (
    <StyledElementForCardLayout kind="wrapper">
      <StyledElementForCardLayout kind="content" name="liquidity">
        <Text
          type="caption"
          color="secondaryText"
          variant="light"
          paddingBottom="9px"
        >
          Bonded tokens
        </Text>
        <Text type="title2" variant="bold">
          $24,034.00
        </Text>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <Text
          paddingBottom="4px"
          type="caption"
          variant="light"
          color="tertiaryText"
        >
          Available reward
        </Text>
        <Text
          paddingBottom="4px"
          type="microscopic"
          variant="light"
          color="tertiaryText"
        >
          Based on your $8,000.00 available
        </Text>

        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="/crab.png" />
            <Text color="bodyText" type="microscopic">
              +34 juno/14d
            </Text>
          </StyledElementForTokens>
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="/crab.png" />
            <Text color="bodyText" type="microscopic">
              +57 juno/14d
            </Text>
          </StyledElementForTokens>
        </StyledElementForTokens>

        <StyledButton>Bond / Unbond tokens</StyledButton>
      </StyledElementForCardLayout>
    </StyledElementForCardLayout>
  )
}

const StyledElementForCardLayout = styled('div', {
  variants: {
    kind: {
      wrapper: {
        position: 'relative',
        zIndex: 0,
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
        padding: '20px 0 22px',
        borderRadius: '8px',
        '&:after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background:
            'radial-gradient(71.15% 71.14% at 29.4% 81.87%, #DFB1E3 0%, rgba(247, 202, 178, 0) 100%)',
          opacity: 0.4,
        },
      },
      content: {
        position: 'relative',
        zIndex: 1,
        padding: '0 24px',
      },
    },
    name: {
      liquidity: {
        padding: '0 20px 26px',
      },
    },
  },
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
        paddingTop: '16px',
        paddingBottom: '24px',
        gridAutoFlow: 'column',
        alignItems: 'center',
        columnGap: '15px',
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