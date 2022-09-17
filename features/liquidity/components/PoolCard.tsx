import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  Card,
  CardContent,
  Column,
  Divider,
  dollarValueFormatterWithDecimals,
  ImageForTokenLogo,
  Inline,
  styled,
  Text,
} from 'junoblocks'
import Link from 'next/link'
import { PoolEntityType } from 'queries/usePoolsListQuery'
import { PoolState, PoolTokenValue } from 'queries/useQueryPools'
import { __POOL_REWARDS_ENABLED__ } from 'util/constants'
import { formatCompactNumber } from 'util/formatCompactNumber'

type PoolCardProps = {
  poolId: string
  providedTotalLiquidity: PoolTokenValue
  stakedLiquidity: PoolState
  availableLiquidity: PoolState
  tokenASymbol: string
  tokenBSymbol: string
  aprValue: number
  rewardsTokens?: PoolEntityType['rewards_tokens']
}

export const PoolCard = ({
  poolId,
  tokenASymbol,
  tokenBSymbol,
  providedTotalLiquidity,
  stakedLiquidity,
  availableLiquidity,
  rewardsTokens,
  aprValue,
}: PoolCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const hasProvidedLiquidity = Boolean(providedTotalLiquidity.tokenAmount)

  const stakedTokenBalanceDollarValue = stakedLiquidity.provided.dollarValue

  const providedLiquidityDollarValueFormatted = hasProvidedLiquidity
    ? formatCompactNumber(providedTotalLiquidity.dollarValue)
    : 0

  const totalDollarValueLiquidityFormatted = formatCompactNumber(
    availableLiquidity.total.dollarValue
  )

  return (
    <Link href={`/pools/${poolId}`} passHref>
      <Card variant="secondary" active={hasProvidedLiquidity}>
        <CardContent size="medium">
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
        <CardContent size="medium">
          <Column gap={3}>
            <Text variant="legend" color="secondary">
              Total liquidity
            </Text>
            <Text variant="primary">
              {hasProvidedLiquidity ? (
                <>
                  <StyledSpanForHighlight>
                    ${providedLiquidityDollarValueFormatted}{' '}
                  </StyledSpanForHighlight>
                  of ${totalDollarValueLiquidityFormatted}
                </>
              ) : (
                <>${totalDollarValueLiquidityFormatted}</>
              )}
            </Text>
          </Column>
          <Inline justifyContent="space-between" css={{ padding: '$14 0' }}>
            <StyledDivForStatsColumn align="left">
              <Text
                variant="legend"
                color={hasProvidedLiquidity ? 'brand' : 'primary'}
                align="left"
              >
                Bonded
              </Text>
              <Text
                variant="primary"
                color={hasProvidedLiquidity ? 'brand' : 'primary'}
              >
                {hasProvidedLiquidity &&
                typeof stakedTokenBalanceDollarValue === 'number' ? (
                  <>${formatCompactNumber(stakedTokenBalanceDollarValue)}</>
                ) : (
                  '--'
                )}
              </Text>
            </StyledDivForStatsColumn>
            {__POOL_REWARDS_ENABLED__ && Boolean(rewardsTokens?.length) && (
              <StyledDivForStatsColumn align="center">
                <Text variant="legend" color="secondary" align="center">
                  Rewards
                </Text>
                <StyledDivForTokenLogos css={{ padding: '$1' }}>
                  {rewardsTokens.map((token) => (
                    <ImageForTokenLogo
                      key={token.symbol}
                      size="medium"
                      logoURI={token.logoURI}
                      alt={token.symbol}
                    />
                  ))}
                </StyledDivForTokenLogos>
              </StyledDivForStatsColumn>
            )}
            <StyledDivForStatsColumn align="right">
              <Text variant="legend" color="secondary" align="right">
                APR
              </Text>

              <Text variant="primary" align="right">
                {dollarValueFormatterWithDecimals(aprValue ?? 0)}%
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

const StyledSpanForHighlight = styled('span', {
  display: 'inline',
  color: '$textColors$brand',
})
