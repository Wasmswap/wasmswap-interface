import { Inline } from 'components/Inline'
import { Text } from 'components/Text'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { Button } from 'components/Button'
import React, { useMemo } from 'react'
import { Divider } from 'components/Divider'
import { Column } from 'components/Column'
import {
  useGetClaims,
  useGetPoolTokensDollarValue,
  usePoolPairTokenAmount,
} from 'hooks/useStakedToken'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
} from 'util/conversion'

const useRedeemableTokensBalance = ({ poolId }) => {
  const [claims, isLoading] = useGetClaims({ poolId })
  const totalStaked = useMemo(() => {
    if (!claims?.length) return 0
    return claims.reduce((value, { amount }) => value + amount, 0)
  }, [claims])

  return {
    amount: totalStaked,
    canRedeem: false,
    isLoading,
  }
}

export const UnbondingStatus = ({ poolId, tokenA, tokenB, size = 'large' }) => {
  /* mocks for getting the amount of tokens that can be redeemed  */
  const { amount, canRedeem } = useRedeemableTokensBalance({ poolId })

  const [tokenAAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount / 2,
    tokenPairIndex: 0,
  })

  const formattedTokenAAmount = formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount / 2,
    tokenPairIndex: 1,
  })

  const formattedTokenBAmount = formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })

  const [redeemableTokenDollarValue] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: amount,
  })

  const formattedRedeemableTokenDollarValue =
    typeof redeemableTokenDollarValue === 'number'
      ? dollarValueFormatterWithDecimals(redeemableTokenDollarValue, {
          includeCommaSeparation: true,
        })
      : '0.00'

  if (size === 'small') {
    return (
      <Column gap={4} css={{ padding: '$20 0 $8' }}>
        <Text variant="primary">Unbonding tokens</Text>
        <Inline
          css={{
            rowGap: '$8',
            columnGap: '$12',
            flexWrap: 'wrap',
            padding: '$12 0',
          }}
        >
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenA.logoURI}
              alt={tokenA.symbol}
            />
            <Text variant="link">{formattedTokenAAmount}</Text>
          </Inline>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenB.logoURI}
              alt={tokenB.symbol}
            />
            <Text variant="link">{formattedTokenBAmount}</Text>
          </Inline>
        </Inline>
        <Divider />
        <Inline justifyContent="space-between" css={{ padding: '$12 0' }}>
          <Text variant="header">${formattedRedeemableTokenDollarValue}</Text>
          <Button variant="primary" disabled={!canRedeem}>
            Redeem
          </Button>
        </Inline>
        <Divider />
      </Column>
    )
  }
  return (
    <>
      <Text variant="primary" css={{ padding: '$20 0 $4' }}>
        Unbonding tokens
      </Text>
      <Inline justifyContent="space-between" css={{ padding: '$12 0' }}>
        <Inline gap={16}>
          <Text variant="header">${formattedRedeemableTokenDollarValue}</Text>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenA.logoURI}
              alt={tokenA.symbol}
            />
            <Text variant="link">{formattedTokenAAmount}</Text>
          </Inline>
          <Inline gap={3}>
            <ImageForTokenLogo
              size="large"
              logoURI={tokenB.logoURI}
              alt={tokenB.symbol}
            />
            <Text variant="link">{formattedTokenBAmount}</Text>
          </Inline>
        </Inline>
        <Button variant="primary" disabled={!canRedeem}>
          Redeem
        </Button>
      </Inline>
      <Divider offsetBottom="$8" />
    </>
  )
}
