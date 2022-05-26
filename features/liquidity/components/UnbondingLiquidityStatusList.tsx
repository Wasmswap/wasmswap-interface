import {
  useClaimTokens,
  usePoolPairTokenAmount,
  usePoolTokensDollarValue,
  useStakingClaims,
} from 'features/liquidity/hooks'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import {
  Button,
  Column,
  Divider,
  dollarValueFormatterWithDecimals,
  Error,
  formatTokenBalance,
  IconWrapper,
  ImageForTokenLogo,
  Inline,
  Text,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import React, { useMemo } from 'react'
import { toast } from 'react-hot-toast'

import { TokenInfo } from '../../../queries/usePoolsListQuery'
import { UnbondingLiquidityCard } from './UnbondingLiquidityCard'

type UnbondingLiquidityStatusListProps = {
  poolId: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  size: 'large' | 'small'
}

export const UnbondingLiquidityStatusList = ({
  poolId,
  tokenA,
  tokenB,
  size = 'large',
}: UnbondingLiquidityStatusListProps) => {
  /* mocks for getting the amount of tokens that can be redeemed  */
  const { amount, claims, canRedeem, hasUnstakingTokens, isLoading } =
    useRedeemableTokensBalance({
      poolId,
    })

  const [tokenAAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 0,
  })

  const formattedTokenAAmount = formatTokenBalance(tokenAAmount, {
    includeCommaSeparation: true,
  })

  const [tokenBAmount] = usePoolPairTokenAmount({
    poolId,
    tokenAmountInMicroDenom: amount,
    tokenPairIndex: 1,
  })

  const formattedTokenBAmount = formatTokenBalance(tokenBAmount, {
    includeCommaSeparation: true,
  })

  const [redeemableTokenDollarValue] = usePoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: amount,
  })

  const formattedRedeemableTokenDollarValue =
    typeof redeemableTokenDollarValue === 'number'
      ? dollarValueFormatterWithDecimals(redeemableTokenDollarValue, {
          includeCommaSeparation: true,
        })
      : '0.00'

  const refetchQueries = useRefetchQueries(
    ['tokenBalance', 'myLiquidity', 'stakedTokenBalance', 'claimTokens'],
    3500
  )

  const { mutate: claimTokens } = useClaimTokens({
    poolId,
    onSuccess() {
      refetchQueries()

      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Valid />} color="valid" />}
          title={`Successfully claimed your tokens in the amount of $${formattedRedeemableTokenDollarValue}`}
          onClose={() => toast.dismiss(t.id)}
        />
      ))
    },
    onError(error) {
      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Error />} color="error" />}
          title={`Couldn't claim your tokens in the amount of $${formattedRedeemableTokenDollarValue}`}
          body={(error as any)?.message ?? error?.toString()}
          buttons={
            <Button
              as="a"
              variant="ghost"
              href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
              target="__blank"
              iconRight={<UpRightArrow />}
            >
              Provide feedback
            </Button>
          }
          onClose={() => toast.dismiss(t.id)}
        />
      ))
    },
  })

  if (!hasUnstakingTokens && !isLoading) {
    return null
  }

  const renderedListForClaims = (
    <Column gap={6}>
      {claims?.map(({ amount, release_at }, idx) => (
        <UnbondingLiquidityCard
          key={idx}
          tokenA={tokenA}
          tokenB={tokenB}
          size={size}
          poolId={poolId}
          amount={amount}
          releaseAt={release_at}
        />
      ))}
    </Column>
  )

  if (size === 'small') {
    return (
      <>
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
            <Button
              variant="primary"
              onClick={claimTokens}
              disabled={!canRedeem}
            >
              Redeem
            </Button>
          </Inline>
          <Divider />
        </Column>
        {renderedListForClaims}
      </>
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
        <Button variant="primary" onClick={claimTokens} disabled={!canRedeem}>
          Redeem
        </Button>
      </Inline>
      <Divider offsetBottom="$8" />
      {renderedListForClaims}
    </>
  )
}

const useRedeemableTokensBalance = ({ poolId }) => {
  const [{ redeemableClaims, allClaims }, isLoading] = useStakingClaims({
    poolId,
  })

  const totalRedeemableAmount = useMemo(() => {
    if (!redeemableClaims?.length) return 0
    return redeemableClaims.reduce((value, { amount }) => value + amount, 0)
  }, [redeemableClaims])

  return {
    amount: totalRedeemableAmount,
    claims: allClaims,
    canRedeem: totalRedeemableAmount > 0,
    hasUnstakingTokens: Boolean(allClaims?.length),
    isLoading,
  }
}
