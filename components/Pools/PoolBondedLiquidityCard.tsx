import { styled } from '@stitches/react'
import { Text } from '../Text'
import { Button } from '../Button'
import { __POOL_REWARDS_ENABLED__ } from '../../util/constants'

export const PoolBondedLiquidityCard = ({ onButtonClick }) => {
  return (
    <StyledElementForCardLayout kind="wrapper">
      <StyledElementForCardLayout kind="content" name="liquidity">
        <Text
          type="caption"
          color="secondaryText"
          variant="light"
          paddingBottom="9px"
        >
          Staked liquidity
        </Text>
        <Text type="title2" variant="bold">
          $0.00
        </Text>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <Text
          paddingBottom="4px"
          type="caption"
          variant="light"
          color="tertiaryText"
        >
          Stake your liquidity
        </Text>
        <Text
          paddingBottom="4px"
          type="microscopic"
          variant="light"
          color="tertiaryText"
        >
          Claim rewards
        </Text>

        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="https://junochain.com/assets/logos/logo_512x512.png" />
            <Text color="bodyText" type="microscopic">
              +0 juno/14d
            </Text>
          </StyledElementForTokens>
          <StyledElementForTokens kind="element">
            <StyledImageForToken src="https://cryptologos.cc/logos/cosmos-atom-logo.svg?v=014" />
            <Text color="bodyText" type="microscopic">
              +0 atom/14d
            </Text>
          </StyledElementForTokens>
        </StyledElementForTokens>
        <StyledButton
          disabled={!__POOL_REWARDS_ENABLED__}
          onClick={__POOL_REWARDS_ENABLED__ ? onButtonClick : undefined}
        >
          {__POOL_REWARDS_ENABLED__ ? 'Bond / Unbond tokens' : 'Coming soon'}
        </StyledButton>
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
