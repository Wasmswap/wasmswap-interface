import Link from 'next/link'
import { styled } from 'components/theme'
import { colorTokens } from '../../../util/constants'
import { Text } from '../../../components/Text'
import { useTokenInfo } from '../../../hooks/useTokenInfo'
import { LiquidityType } from '../../../hooks/usePoolLiquidity'

type PoolCardProps = {
  poolId: string
  tokenASymbol: string
  tokenBSymbol: string
  totalLiquidity: LiquidityType
  myLiquidity: LiquidityType
}

export const parseCurrency = (value: number | string) =>
  Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

export const PoolCard = ({
  poolId,
  tokenASymbol,
  tokenBSymbol,
  totalLiquidity,
  myLiquidity,
}: PoolCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const hasProvidedLiquidity =
    typeof myLiquidity.coins === 'number' && myLiquidity.coins > 0

  return (
    <Link href={`/pools/${poolId}`} passHref>
      <StyledLinkForCard>
        <>
          <StyledDivForRowWrapper>
            <StyledDivForTokenLogos>
              <StyledImageForTokenLogo
                src={tokenA.logoURI}
                as={tokenA.logoURI ? 'img' : 'div'}
              />
              <StyledImageForTokenLogo
                src={tokenB.logoURI}
                as={tokenB.logoURI ? 'img' : 'div'}
              />
            </StyledDivForTokenLogos>
            <Text variant="body">Pool #{poolId}</Text>
            <StyledTextForTokenNames variant="primary">
              {tokenA.symbol} <span /> {tokenB.symbol}
            </StyledTextForTokenNames>
          </StyledDivForRowWrapper>
        </>

        <StyledDivForSeparator />

        <StyledDivForLiquidityRows highlighted={hasProvidedLiquidity}>
          <>
            <StyledDivForRowWrapper>
              <StyledDivForRow>
                <Text color="secondary" variant="body">
                  Total liquidity
                </Text>
                <Text color="secondary" variant="body">
                  APR
                </Text>
              </StyledDivForRow>
              <StyledDivForRow>
                <Text>{parseCurrency(totalLiquidity.dollarValue)}</Text>
                <Text>0%</Text>
              </StyledDivForRow>
            </StyledDivForRowWrapper>
          </>

          {hasProvidedLiquidity && (
            <>
              <StyledDivForSeparator />
              <StyledDivForRowWrapper>
                <StyledDivForRow>
                  <Text color="secondary" variant="body">
                    My liquidity
                  </Text>
                  <Text color="secondary" variant="body">
                    Staked
                  </Text>
                </StyledDivForRow>
                <StyledDivForRow>
                  <Text>{parseCurrency(myLiquidity.dollarValue)}</Text>
                  <Text>$0</Text>
                </StyledDivForRow>
              </StyledDivForRowWrapper>
            </>
          )}
        </StyledDivForLiquidityRows>
      </StyledLinkForCard>
    </Link>
  )
}

export const PoolCardFetching = ({ hasLiquidityProvided = true }) => {
  return (
    <StyledLinkForCard
      as="div"
      variant={hasLiquidityProvided ? 'fetching--active' : 'fetching'}
    >
      <StyledDivForTokenLogos>
        <StyledImageForTokenLogo as="div" />
        <StyledImageForTokenLogo as="div" />
      </StyledDivForTokenLogos>
      {hasLiquidityProvided && (
        <>
          <StyledDivForLiquidityRows highlighted={true} placeholder={true}>
            <StyledDivForSeparator />
            <StyledDivForSeparator />
          </StyledDivForLiquidityRows>
        </>
      )}
    </StyledLinkForCard>
  )
}

const StyledLinkForCard = styled('a', {
  cursor: 'pointer',
  borderRadius: 8,
  backgroundColor: '$backgroundColors$primary',
  position: 'relative',
  transition: 'background-color 0.1s ease-out',
  '&:hover': {
    backgroundColor: '$colors$dark15',
  },
  '&:active': {
    backgroundColor: '$colors$dark5',
  },
  variants: {
    variant: {
      fetching: {
        minHeight: '184px',
      },
      'fetching--active': {
        minHeight: '288px',
      },
    },
  },
})

const StyledDivForTokenLogos = styled('div', {
  position: 'absolute',
  right: 24,
  top: 18,
  display: 'flex',
  alignItems: 'center',
})

const StyledImageForTokenLogo = styled('img', {
  width: 26,
  height: 26,
  borderRadius: '50%',
  objectFit: 'fit',
  backgroundColor: '#ccc',
  position: 'relative',
  zIndex: 0,
  '&:first-child': {
    boxShadow: '0 0 0 $space$1 #E8E8E9',
    zIndex: 1,
  },
})

const StyledTextForTokenNames: typeof Text = styled(Text, {
  paddingTop: '$3',
  paddingBottom: '$2',
  display: 'flex',
  alignItems: 'center',
  '& span': {
    width: 4,
    height: 4,
    margin: '0 $3',
    borderRadius: '50%',
    backgroundColor: colorTokens.black,
  },
})

const StyledDivForSeparator = styled('hr', {
  margin: '0 auto',
  border: 'none',
  borderTop: '1px solid rgba(25, 29, 32, 0.1)',
  width: 'calc(100% - 48px)',
  boxSizing: 'border-box',
  height: 1,
})

const StyledDivForRowWrapper = styled('div', {
  padding: '20px 24px 24px',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const StyledDivForLiquidityRows = styled('div', {
  variants: {
    placeholder: {
      true: {
        display: 'grid',
        rowGap: 0,
        position: 'absolute !important',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 'calc(100% - 100% / 3)',
      },
    },
    highlighted: {
      true: {
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          zIndex: 0,
          left: 0,
          top: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(71.15% 71.14% at 29.4% 81.87%, #DFB1E3 0%, rgba(247, 202, 178, 0) 100%)',
          opacity: 0.4,
          borderRadius: '0 0 8px 8px',
        },
      },
    },
  },
})
