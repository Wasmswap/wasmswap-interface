import { Card, CardContent } from 'components/Card'
import { Inline } from 'components/Inline'
import { Text } from 'components/Text'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { ErrorIcon } from 'icons/Error'

export const UnbondingLiquidityCard = ({ tokenA, tokenB, size = 'large' }) => {
  if (size === 'small') {
    return (
      <Card>
        <CardContent size="medium">
          <Inline css={{ padding: '$4 0' }} gap={4}>
            <ErrorIcon />
            <Text variant="legend">3 hr left / 14 days</Text>
          </Inline>
          <Inline justifyContent="space-between" css={{ paddingBottom: '$10' }}>
            <Inline gap={12}>
              <Inline gap={3}>
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenA.logoURI}
                  alt={tokenA.symbol}
                />
                <Text variant="link">0 {tokenA.symbol}</Text>
              </Inline>
              <Inline gap={3}>
                <ImageForTokenLogo
                  size="medium"
                  logoURI={tokenB.logoURI}
                  alt={tokenB.symbol}
                />
                <Text variant="link">0 {tokenB.symbol}</Text>
              </Inline>
            </Inline>
            <Text variant="link">$289.00</Text>
          </Inline>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardContent>
        <Inline justifyContent="space-between" css={{ padding: '$11 0' }}>
          <Inline gap={16}>
            <Text variant="link">$289.00</Text>
            <Inline gap={12}>
              <Inline gap={3}>
                <ImageForTokenLogo
                  logoURI={tokenA.logoURI}
                  alt={tokenA.symbol}
                />
                <Text variant="link">0 {tokenA.symbol}</Text>
              </Inline>
              <Inline gap={3}>
                <ImageForTokenLogo
                  logoURI={tokenB.logoURI}
                  alt={tokenB.symbol}
                />
                <Text variant="link">0 {tokenB.symbol}</Text>
              </Inline>
            </Inline>
          </Inline>
          <Inline>
            <Text variant="legend">3 hr left / 14 days</Text>
          </Inline>
        </Inline>
      </CardContent>
    </Card>
  )
}
