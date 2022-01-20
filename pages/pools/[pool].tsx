import React, { useState } from 'react'
import { styled } from 'components/theme'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLayout } from 'components/Layout/AppLayout'
import { Text } from 'components/Text'
import { IconWrapper } from 'components/IconWrapper'
import {
  ManageBondedLiquidityCard,
  UnbondingLiquidityCard,
  ManagePoolDialog,
  ManageLiquidityCard,
} from 'features/liquidity'
import { Button } from 'components/Button'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { useTokenToTokenPrice } from 'features/swap/hooks/useTokenToTokenPrice'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { StyledDivForTokenLogos } from 'features/liquidity/components/PoolCard'
import { __POOL_REWARDS_ENABLED__, APP_NAME } from 'util/constants'
import { BondLiquidityDialog } from 'features/liquidity'
import { Spinner } from 'components/Spinner'
import { ArrowUp } from 'icons'
import { Divider } from 'components/Divider'
import { Inline } from 'components/Inline'
import { ImageForTokenLogo } from 'components/ImageForTokenLogo'
import { dollarValueFormatterWithDecimals } from 'util/conversion'
import { Column } from 'components/Column'
import { RewardsStatus } from 'features/liquidity/components/RewardsStatus'
import { UnbondingStatus } from 'features/liquidity/components/UnbondingStatus'

export default function Pool() {
  const {
    query: { pool },
  } = useRouter()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })
  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(pool as string)

  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.symbol,
    tokenBSymbol: tokenB?.symbol,
    tokenAmount: 1,
  })

  const [
    { totalLiquidity, myLiquidity, myReserve, tokenDollarValue } = {} as any,
    isLoading,
  ] = usePoolLiquidity({ poolId: pool })

  const isLoadingInitial = !totalLiquidity || (!totalLiquidity && isLoading)

  if (!tokenB || !pool) {
    return null
  }

  return (
    <>
      {pool && (
        <ManagePoolDialog
          isShowing={isManageLiquidityDialogShowing}
          initialActionType={actionType}
          onRequestClose={() =>
            setManageLiquidityDialogState({
              isShowing: false,
              actionType: 'add',
            })
          }
          poolId={pool as string}
        />
      )}
      {__POOL_REWARDS_ENABLED__ && (
        <BondLiquidityDialog
          isShowing={isBondingDialogShowing}
          onRequestClose={() => setIsBondingDialogShowing(false)}
          poolId={pool}
        />
      )}

      {pool && (
        <Head>
          <title>
            {APP_NAME} — Pool {tokenB.pool_id}
          </title>
        </Head>
      )}

      <AppLayout>
        <StyledWrapperForNavigation>
          <StyledNavElement position="left">
            <Link href="/pools" passHref>
              <Button
                iconLeft={<IconWrapper icon={<ArrowUp />} rotation="-90deg" />}
                variant="ghost"
                as="a"
              >
                Back
              </Button>
            </Link>
          </StyledNavElement>
          <StyledNavElement position="center">
            <Text variant="header" transform="capitalize">
              Pool {tokenA.name} + {tokenB.name}
            </Text>
          </StyledNavElement>
        </StyledWrapperForNavigation>

        <Divider />

        {isLoadingInitial && (
          <StyledDivForSpinner>
            <Spinner color="black" size={32} />
          </StyledDivForSpinner>
        )}

        {!isLoadingInitial && (
          <>
            <Inline justifyContent="space-between" css={{ padding: '$8 0' }}>
              <Inline gap={18}>
                <Text variant="primary">Pool #{tokenB.pool_id}</Text>
                <Inline gap={12}>
                  <Inline gap={6}>
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
                  </Inline>
                </Inline>
              </Inline>
              <Text variant="legend" color="secondary" transform="lowercase">
                {isPriceLoading
                  ? ''
                  : `1 ${tokenA.symbol} = ${tokenPrice} ${tokenB.symbol}`}
              </Text>
            </Inline>

            <Divider />

            <>
              <Inline
                css={{
                  display: 'grid',
                  gridTemplateColumns: __POOL_REWARDS_ENABLED__
                    ? '1fr 1fr 1fr'
                    : '1fr 1fr',
                  padding: '$12 0 $16',
                }}
              >
                <Column gap={6} align="flex-start" justifyContent="flex-start">
                  <Text variant="legend" color="secondary" align="left">
                    Total liquidity
                  </Text>
                  <Text variant="header">
                    $
                    {dollarValueFormatterWithDecimals(
                      totalLiquidity?.dollarValue,
                      { includeCommaSeparation: true }
                    )}
                  </Text>
                </Column>

                {__POOL_REWARDS_ENABLED__ && (
                  <Column gap={6} align="center" justifyContent="center">
                    <Text variant="legend" color="secondary" align="center">
                      Token reward
                    </Text>
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
                  </Column>
                )}

                <Column gap={6} align="flex-end" justifyContent="flex-end">
                  <Text variant="legend" color="secondary" align="right">
                    APR reward
                  </Text>
                  <Text variant="header">0%</Text>
                </Column>
              </Inline>
            </>

            <>
              <StyledDivForCards>
                <ManageLiquidityCard
                  myReserve={myReserve}
                  tokenDollarValue={tokenDollarValue}
                  tokenASymbol={tokenA.symbol}
                  tokenBSymbol={tokenB.symbol}
                  onAddLiquidityClick={() =>
                    setManageLiquidityDialogState({
                      isShowing: true,
                      actionType: 'add',
                    })
                  }
                  onRemoveLiquidityClick={() => {
                    setManageLiquidityDialogState({
                      isShowing: true,
                      actionType: 'remove',
                    })
                  }}
                />
                <ManageBondedLiquidityCard
                  onButtonClick={() => setIsBondingDialogShowing(true)}
                  myLiquidity={myLiquidity}
                  tokenASymbol={tokenA.symbol}
                  tokenBSymbol={tokenB.symbol}
                />
              </StyledDivForCards>
            </>
            <>
              {__POOL_REWARDS_ENABLED__ && (
                <>
                  <RewardsStatus tokenA={tokenA} tokenB={tokenB} />
                  <Divider />
                  <UnbondingStatus tokenA={tokenA} tokenB={tokenB} />
                  <Divider offsetBottom="$8" />
                  <Column gap={6}>
                    <UnbondingLiquidityCard tokenA={tokenA} tokenB={tokenB} />
                    <UnbondingLiquidityCard tokenA={tokenA} tokenB={tokenB} />
                    <UnbondingLiquidityCard tokenA={tokenA} tokenB={tokenB} />
                  </Column>
                </>
              )}
              {!__POOL_REWARDS_ENABLED__ && (
                <RewardsStatus
                  disabled={true}
                  tokenA={tokenA}
                  tokenB={tokenB}
                />
              )}
            </>
          </>
        )}
      </AppLayout>
    </>
  )
}

const StyledWrapperForNavigation = styled('nav', {
  padding: '$11 0',
  display: 'flex',
  alignItems: 'center',
})

const StyledNavElement = styled('div', {
  display: 'flex',
  variants: {
    position: {
      left: {
        flex: 0.1,
        justifyContent: 'flex-start',
      },
      center: {
        flex: 0.8,
        justifyContent: 'center',
      },
      right: {
        flex: 0.1,
        justifyContent: 'flex-end',
      },
    },
  },
})

const StyledDivForCards = styled('div', {
  display: 'grid',
  columnGap: '$8',
  gridTemplateColumns: '1fr 1fr',
})

const StyledDivForSpinner = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 143,
})
