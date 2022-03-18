import {
  Card,
  CardContent,
  Column,
  Divider,
  ImageForTokenLogo,
  Inline,
  Text,
} from 'components'
import { LiquidityType } from 'hooks/usePoolLiquidity'
import { useTokenInfo } from 'hooks/useTokenInfo'
import Link from 'next/link'
import { styled } from 'theme'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from 'util/conversion'

type PoolCardProps = {
  poolId: string
  tokenASymbol: string
  tokenBSymbol: string
  totalLiquidity: LiquidityType
  myLiquidity: LiquidityType
  myStakedLiquidity: LiquidityType
  rewardsInfo?: any
}

export const PoolCard = ({
  poolId,
  tokenASymbol,
  tokenBSymbol,
  totalLiquidity,
  myStakedLiquidity,
  rewardsInfo,
  myLiquidity,
}: PoolCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const stakedTokenBalanceDollarValue = myStakedLiquidity.dollarValue

  const hasProvidedLiquidity = Boolean(
    myLiquidity.tokenAmount || stakedTokenBalanceDollarValue
  )

  return (
    <Link href={`/pools/${poolId}`} passHref>
      <Card variant="secondary" active={hasProvidedLiquidity}>
        <CardContent>
          <Column align="center">
            <StyledDivForTokenLogos css={{ paddingTop: '$20' }}>
              <ImageForTokenLogo
                size="big"
                logoURI={tokenA.logoURI}
                alt={tokenA.symbol}
              />
              <ImageForTokenLogo
                size="big"
                logoURI={tokenB.logoURI}
                alt={tokenB.symbol}
              />
            </StyledDivForTokenLogos>
            <StyledTextForTokenNames
              variant="title"
              align="center"
              css={{ paddingTop: '$8' }}
            >
              {tokenA.symbol} <span /> {tokenB.symbol}
            </StyledTextForTokenNames>
          </Column>
        </CardContent>
        <Divider offsetTop="$16" offsetBottom="$12" />
        <CardContent>
          <Column gap={3}>
            <Text variant="legend" color="secondary">
              Total liquidity
            </Text>
            <Text variant="primary">
              $
              {dollarValueFormatterWithDecimals(totalLiquidity.dollarValue, {
                includeCommaSeparation: true,
              })}
            </Text>
          </Column>
          <Inline justifyContent="space-between" css={{ padding: '$14 0' }}>
            <StyledDivForStatsColumn align="left">
              <Text variant="legend" color="secondary" align="left">
                Staked
              </Text>
              <Text variant="primary">
                $
                {dollarValueFormatterWithDecimals(
                  typeof stakedTokenBalanceDollarValue === 'number'
                    ? stakedTokenBalanceDollarValue
                    : 0,
                  {
                    includeCommaSeparation: true,
                  }
                )}
              </Text>
            </StyledDivForStatsColumn>
            <StyledDivForStatsColumn align="center">
              <Text variant="legend" color="secondary" align="center">
                Rewards
              </Text>
              <StyledDivForTokenLogos css={{ paddingTop: '0' }}>
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenA.logoURI}
                  alt={tokenA.symbol}
                />
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenB.logoURI}
                  alt={tokenB.symbol}
                />
              </StyledDivForTokenLogos>
            </StyledDivForStatsColumn>
            <StyledDivForStatsColumn align="right">
              <Text variant="legend" color="secondary" align="right">
                APR
              </Text>

              <Text variant="primary" align="right">
                {dollarValueFormatter(rewardsInfo?.yieldPercentageReturn ?? 0)}%
              </Text>
            </StyledDivForStatsColumn>
          </Inline>
        </CardContent>
      </Card>
    </Link>
  )
}

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

const StyledDivForStatsColumn = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 0.3,
  justifyContent: 'center',
  alignItems: 'center',
  rowGap: '$space$3',
  variants: {
    align: {
      left: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      center: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      right: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    },
  },
})
