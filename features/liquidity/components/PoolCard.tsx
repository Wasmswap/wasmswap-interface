import Link from 'next/link'
import { styled } from 'components/theme'
import { Text } from 'components/Text'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { LiquidityType } from 'hooks/usePoolLiquidity'
import { Card, CardContent } from 'components/Card'
import { Divider } from 'components/Divider'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { dollarValueFormatterWithDecimals } from 'util/conversion'
import { MultisigIcon } from 'icons/Multisig'

type PoolCardProps = {
  poolId: string
  tokenASymbol: string
  tokenBSymbol: string
  totalLiquidity: LiquidityType
  myLiquidity: LiquidityType
}

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
      <Card>
        <CardContent>
          <Text
            variant="legend"
            color="secondary"
            css={{ padding: '$14 0 $6' }}
          >
            Pool #{poolId}
          </Text>

          <StyledDivForPoolTokens>
            <StyledDivForTokenLogos>
              <ImageForTokenLogo
                size="large"
                logoURI={tokenA.logoURI}
                alt={tokenA.symbol}
              />
              <ImageForTokenLogo
                size="large"
                logoURI={tokenB.logoURI}
                alt={tokenB.symbol}
              />
            </StyledDivForTokenLogos>
            <StyledTextForTokenNames
              variant="title"
              css={{ paddingLeft: '$6' }}
            >
              {tokenA.symbol} <span /> {tokenB.symbol}
            </StyledTextForTokenNames>
          </StyledDivForPoolTokens>
        </CardContent>
        <Divider offsetTop="$16" />
        <CardContent>
          <StyledDivForStatsRowWrapper>
            <StyledDivForStatsRow>
              <Text variant="legend" color="secondary">
                Total liquidity
              </Text>
              <Text variant="legend" color="secondary">
                APR
              </Text>
            </StyledDivForStatsRow>
            <StyledDivForStatsRow>
              <Text variant="primary">
                $
                {dollarValueFormatterWithDecimals(totalLiquidity.dollarValue, {
                  includeCommaSeparation: true,
                })}
              </Text>
              <Text variant="primary">0%</Text>
            </StyledDivForStatsRow>
          </StyledDivForStatsRowWrapper>
        </CardContent>
        {hasProvidedLiquidity && (
          <StyledDivForStatsActiveRowWrapper>
            <StyledDivForStatsRow>
              <Text variant="legend" color="secondary">
                My liquidity
              </Text>
              <Text variant="legend" color="brand">
                Staked
              </Text>
            </StyledDivForStatsRow>
            <StyledDivForStatsRow>
              <Text variant="primary">
                $
                {dollarValueFormatterWithDecimals(myLiquidity.dollarValue, {
                  includeCommaSeparation: true,
                })}
              </Text>
              <StyledDivForStakedRowValue>
                <MultisigIcon color="brand" size="24px" />
                <Text variant="primary" color="brand">
                  $0.00
                </Text>
              </StyledDivForStakedRowValue>
            </StyledDivForStatsRow>
          </StyledDivForStatsActiveRowWrapper>
        )}
      </Card>
    </Link>
  )
}

const StyledDivForPoolTokens = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

export const StyledDivForTokenLogos = styled('div', {
  display: 'flex',
  [`& ${ImageForTokenLogo}`]: {
    position: 'relative',
    zIndex: '$2',
    backgroundColor: '$white',
    '&:not(&:first-of-type)': {
      backgroundColor: 'transparent',
      marginLeft: '-0.25rem',
      zIndex: '$1',
    },
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
    backgroundColor: '$textColors$primary',
  },
})

const StyledDivForStatsRowWrapper = styled('div', {
  display: 'flex',
  rowGap: '$3',
  padding: '$12 0',
  flexWrap: 'wrap',
})

const StyledDivForStatsActiveRowWrapper = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  padding: '$9 $12',
  margin: '0 $8 $8',
  rowGap: '$2',
  backgroundColor: '$colors$brand10',
  borderRadius: '$1',
})

const StyledDivForStatsRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
})

const StyledDivForStakedRowValue = styled('div', {
  columnGap: '$2',
  display: 'flex',
  alignItems: 'center',
})
