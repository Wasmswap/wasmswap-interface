import Link from 'next/link'
import { styled } from '@stitches/react'
import { colorTokens } from '../../util/constants'
import { Text } from '../Text'
import { usePoolLiquidity } from '../../hooks/usePoolLiquidity'
import { useTokenInfo } from '../../hooks/useTokenInfo'

type PoolCardProps = {
  poolId: number
  tokenASymbol: string
  tokenBSymbol: string
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
}: PoolCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const { totalLiquidity, myLiquidity } = usePoolLiquidity({
    poolId,
  })

  const hasProvidedLiquidity = typeof myLiquidity.coins === 'number'

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
            <Text type="caption" variant="normal">
              Pool #{poolId}
            </Text>
            <StyledTextForTokenNames type="body" variant="normal">
              {tokenA.symbol} <span /> {tokenB.symbol}
            </StyledTextForTokenNames>
          </StyledDivForRowWrapper>
        </>

        <StyledDivForSeparator />

        <StyledDivForLiquidityRows highlighted={hasProvidedLiquidity}>
          <>
            <StyledDivForRowWrapper>
              <StyledDivForRow>
                <StyledTextForSubtitle
                  color="secondaryText"
                  type="caption"
                  variant="normal"
                >
                  Total liquidity
                </StyledTextForSubtitle>
                <StyledTextForSubtitle
                  color="secondaryText"
                  type="caption"
                  variant="normal"
                >
                  APR
                </StyledTextForSubtitle>
              </StyledDivForRow>
              <StyledDivForRow>
                <Text>{parseCurrency(totalLiquidity.dollarValue)}</Text>
                <Text>150%</Text>
              </StyledDivForRow>
            </StyledDivForRowWrapper>
          </>

          {hasProvidedLiquidity && (
            <>
              <StyledDivForSeparator />
              <StyledDivForRowWrapper>
                <StyledDivForRow>
                  <StyledTextForSubtitle
                    color="secondaryText"
                    type="caption"
                    variant="normal"
                  >
                    My liquidity
                  </StyledTextForSubtitle>
                  <StyledTextForSubtitle
                    color="secondaryText"
                    type="caption"
                    variant="normal"
                  >
                    Bonded
                  </StyledTextForSubtitle>
                </StyledDivForRow>
                <StyledDivForRow>
                  <Text>{parseCurrency(myLiquidity.dollarValue)}</Text>
                  <Text>$999</Text>
                </StyledDivForRow>
              </StyledDivForRowWrapper>
            </>
          )}
        </StyledDivForLiquidityRows>
      </StyledLinkForCard>
    </Link>
  )
}

const StyledLinkForCard = styled('a', {
  cursor: 'pointer',
  borderRadius: 8,
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  position: 'relative',
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
    boxShadow: '0 0 0 2px #E8E8E9',
    zIndex: 1,
  },
})

const StyledTextForTokenNames: typeof Text = styled(Text, {
  paddingTop: 5,
  paddingBottom: 4,
  display: 'flex',
  alignItems: 'center',
  '& span': {
    width: 4,
    height: 4,
    margin: '0 6px',
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
})

const StyledDivForRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const StyledTextForSubtitle: typeof Text = styled(Text, {
  paddingBottom: 4,
})

const StyledDivForLiquidityRows = styled('div', {
  variants: {
    highlighted: {
      true: {
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(71.15% 71.14% at 29.4% 81.87%, #DFB1E3 0%, rgba(247, 202, 178, 0) 100%)',
          opacity: 0.4,
        },
      },
    },
  },
})
