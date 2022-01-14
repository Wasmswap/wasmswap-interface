import { styled } from 'components/theme'
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
        <Text variant="body" color="secondary" css={{ paddingBottom: '$4' }}>
          Staked liquidity
        </Text>
        <Text variant="hero">$0.00</Text>
        <Text variant="caption" css={{ paddingTop: '$4' }}>
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
        <Text variant="body" color="secondary" css={{ padding: '$7 0 $8' }}>
          Current reward incentive
        </Text>

        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="column">
            <StyledImageForToken src={tokenA.logoURI} />
            <StyledImageForToken src={tokenB.logoURI} />
          </StyledElementForTokens>
          <Text color="body" variant="caption">
            $0.00/14 days in 2 tokens
          </Text>
        </StyledElementForTokens>

        <Button
          css={{ width: '100%' }}
          size="large"
          disabled={!__POOL_REWARDS_ENABLED__}
          onClick={__POOL_REWARDS_ENABLED__ ? onButtonClick : undefined}
        >
          {__POOL_REWARDS_ENABLED__ ? 'Bond / Unbond tokens' : 'Coming soon'}
        </Button>
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
        backgroundColor: '$backgroundColors$primary',
        padding: '$9 0 $12',
        borderRadius: '$2',
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
          borderBottomRightRadius: '$2',
          borderBottomLeftRadius: '$2',
        },
      },
      content: {
        position: 'relative',
        zIndex: 1,
        padding: '0 $12',
      },
    },
    name: {
      liquidity: {
        padding: '0 $10 $6',
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
        paddingBottom: '$11',
        columnGap: '$space$5',
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
