import { styled } from '@stitches/react'
import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { __POOL_REWARDS_ENABLED__ } from 'util/constants'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { Divider } from './Divider'
import { dollarValueFormatterWithDecimals } from '../../../util/conversion'

export const PoolBondedLiquidityCard = ({
  onButtonClick,
  tokenASymbol,
  tokenBSymbol,
  myLiquidity,
}) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

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
        <Text type="microscopic" variant="light" paddingTop="8px">
          $
          {dollarValueFormatterWithDecimals(myLiquidity.dollarValue, {
            includeCommaSeparation: true,
            applyNumberConversion: false,
          })}{' '}
          unstaked tokens
        </Text>
      </StyledElementForCardLayout>
      <Divider />
      <StyledElementForCardLayout kind="content">
        <Text
          type="caption"
          variant="light"
          color="secondaryText"
          paddingTop="14px"
          paddingBottom="16px"
        >
          Current reward incentive
        </Text>

        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="column">
            <StyledImageForToken src={tokenA.logoURI} />
            <StyledImageForToken src={tokenB.logoURI} />
          </StyledElementForTokens>
          <Text color="bodyText" type="microscopic">
            $0.00/14 days in 2 tokens
          </Text>
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
        padding: '18px 0 24px',
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
        padding: '0px 20px 13px',
      },
    },
  },
})

const StyledElementForTokens = styled('div', {
  display: 'flex',
  alignItems: 'center',

  variants: {
    kind: {
      wrapper: {
        paddingBottom: 22,
        columnGap: 10,
      },
      column: {},
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
  boxShadow: '0 0 0 1px #e7d9e3',
  '&:not(&:first-of-type)': {
    marginLeft: -3,
  },
})

const StyledButton = styled(Button, {
  width: '100% !important',
})
