import {
  Button,
  Card,
  CardContent,
  Divider,
  ImageForTokenLogo,
  Inline,
  Text,
} from 'components'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { useSubscribeInteractions } from 'hooks/useSubscribeInteractions'
import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  convertMicroDenomToDenom,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'

type ManageLiquidityCardProps = Pick<
  LiquidityInfoType,
  'myReserve' | 'tokenDollarValue'
> & {
  stakedBalance: number
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
  stakedBalance,
}: ManageLiquidityCardProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const [refForCard, cardInteractionState] = useSubscribeInteractions()

  const providedLiquidity = myReserve?.[0] > 0
  const bondedLiquidity = stakedBalance > 0

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
      variant={providedLiquidity || bondedLiquidity ? 'primary' : 'secondary'}
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
            <Text variant="body">
              {tokenAReserve} {tokenA.symbol}
            </Text>
          </Inline>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenB.logoURI}
              alt={tokenB.symbol}
            />
            <Text variant="body">
              {tokenBReserve} {tokenB.symbol}
            </Text>
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
