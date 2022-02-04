import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { MultisigIcon } from 'icons/Multisig'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { Divider } from 'components/Divider'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from 'util/conversion'
import { Card, CardContent } from 'components/Card'
import { Inline } from 'components/Inline'
import { SharesIcon } from 'icons/Shares'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { StyledDivForTokenLogos } from './PoolCard'
import { __POOL_REWARDS_ENABLED__ } from 'util/constants'

export const ManageBondedLiquidityCard = ({
  onButtonClick,
  tokenASymbol,
  tokenBSymbol,
  myLiquidity,
}) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const bondedLiquidity = __POOL_REWARDS_ENABLED__ && false

  const unstakedLiquidityDollarValue = dollarValueFormatter(
    parseInt(myLiquidity.dollarValue, 10),
    {
      includeCommaSeparation: true,
    }
  )

  const bondedLiquidityDollarValue = dollarValueFormatterWithDecimals(0.0, {
    includeCommaSeparation: true,
  })

  return (
    <Card>
      <CardContent>
        <Inline gap={1} css={{ padding: '$12 0 $3' }}>
          <SharesIcon color="brand" size="24px" />
          <Text variant="legend" color="brand">
            Staked liquidity
          </Text>
        </Inline>
        <Text variant="hero">${bondedLiquidityDollarValue}</Text>
      </CardContent>
      <Divider offsetTop="$16" offsetBottom="$10" />
      <CardContent>
        {!bondedLiquidity && (
          <>
            <Text
              variant="legend"
              color="secondary"
              css={{ paddingBottom: '4.55rem' }}
            >
              Currently no incentive
            </Text>
            <Inline justifyContent="flex-end">
              <Button
                onClick={onButtonClick}
                variant="ghost"
                iconRight={<MultisigIcon />}
                disabled={!__POOL_REWARDS_ENABLED__}
              >
                ${unstakedLiquidityDollarValue} to stake
              </Button>
            </Inline>
          </>
        )}
        {bondedLiquidity && (
          <>
            <Text variant="legend" color="secondary">
              Current reward incentive
            </Text>
            <Inline gap={6} css={{ padding: '$6 0 $18' }}>
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
              <Text variant="link">$105/days in 4 tokens</Text>
            </Inline>
            <Inline
              gap={4}
              justifyContent="flex-end"
              css={{ paddingBottom: '$10' }}
            >
              <Button variant="menu" onClick={onButtonClick}>
                ${unstakedLiquidityDollarValue} unstaked
              </Button>
              <Button variant="secondary" onClick={onButtonClick}>
                Manage staking
              </Button>
            </Inline>
          </>
        )}
      </CardContent>
    </Card>
  )
}
