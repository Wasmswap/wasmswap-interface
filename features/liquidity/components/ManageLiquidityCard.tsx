import { Text } from 'components/Text'
import { Button } from 'components/Button'
import { CardContent, Card } from 'components/Card'
import {
  convertMicroDenomToDenom,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { Inline } from '../../../components/Inline'
import { Divider } from '../../../components/Divider'
import { ImageForTokenLogo } from '../../../components/ImageForTokenLogo'
import { useSubscribeInteractions } from '../../../hooks/useSubscribeInteractions'

type ManageLiquidityCardProps = Pick<
  LiquidityInfoType,
  'myReserve' | 'tokenDollarValue'
> & {
  onClick: () => void
  tokenASymbol: string
  tokenBSymbol: string
}

export const ManageLiquidityCard = ({
  onClick,
  myReserve,
  tokenDollarValue,
  tokenASymbol,
  tokenBSymbol,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const providedLiquidity = myReserve?.[0] > 0

  const tokenAReserve = formatTokenBalance(
    convertMicroDenomToDenom(myReserve?.[0], tokenA.decimals),
    { includeCommaSeparation: true }
  )
  const tokenBReserve = formatTokenBalance(
    convertMicroDenomToDenom(myReserve?.[1], tokenB.decimals),
    { includeCommaSeparation: true }
  )

  const providedLiquidityDollarValue = dollarValueFormatterWithDecimals(
    convertMicroDenomToDenom(myReserve?.[0], tokenA.decimals) *
      tokenDollarValue *
      2 || '0.00',
    { includeCommaSeparation: true }
  )

  return (
    <Card
      ref={refForCard}
      tabIndex={-1}
      role="button"
      variant={providedLiquidity ? 'primary' : 'secondary'}
      onClick={onClick}
    >
      <CardContent>
        <Text variant="legend" color="body" css={{ padding: '$16 0 $6' }}>
          Available liquidity
        </Text>
        <Text variant="hero">${providedLiquidityDollarValue}</Text>
      </CardContent>
      <Divider offsetTop="$22" offsetBottom="$12" />
      <CardContent>
        <Text variant="legend" color="secondary">
          Underlying assets
        </Text>
        <Inline gap={12} css={{ padding: '$6 0 $22' }}>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenA.logoURI}
              alt={tokenA.symbol}
            />
            <Text variant="body">{tokenAReserve}</Text>
          </Inline>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenB.logoURI}
              alt={tokenB.symbol}
            />
            <Text variant="body">{tokenBReserve}</Text>
          </Inline>
        </Inline>
        <Inline css={{ paddingBottom: '$13' }}>
          {providedLiquidity && (
            <Button
              variant="secondary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Manage Liquidity
            </Button>
          )}
          {!providedLiquidity && (
            <Button
              variant="primary"
              size="large"
              state={cardInteractionState}
              css={{ width: '100%' }}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Add Liquidity
            </Button>
          )}
        </Inline>
      </CardContent>
    </Card>
  )
}
