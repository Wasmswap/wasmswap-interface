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
import { ArrowUp } from '../../icons'
import { Divider } from '../../components/Divider'
import { Inline } from '../../components/Inline'
import { ImageForTokenLogo } from '../../components/ImageForTokenLogo'
import { dollarValueFormatterWithDecimals } from '../../util/conversion'
import { Column } from '../../components/Column'
import { RewardsStatus } from '../../features/liquidity/components/RewardsStatus'

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
                  gridTemplateColumns: '1fr 1fr 1fr',
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
              <RewardsStatus tokenA={tokenA} tokenB={tokenB} />
              <Divider />
            </>

            <>
              {__POOL_REWARDS_ENABLED__ && (
                <>
                  <StyledElementForRewards kind="wrapper">
                    <StyledElementForRewards kind="column">
                      <Text variant="hero">$289.00</Text>
                    </StyledElementForRewards>

                    <StyledElementForRewards kind="tokens">
                      <StyledTextForTokens kind="element">
                        <StyledImageForToken src="/crab.png" />
                        <Text color="body" variant="caption">
                          11 juno
                        </Text>
                      </StyledTextForTokens>
                      <StyledTextForTokens kind="element">
                        <StyledImageForToken src="/crab.png" />
                        <Text color="body" variant="caption">
                          31 atom
                        </Text>
                      </StyledTextForTokens>
                    </StyledElementForRewards>

                    <StyledElementForRewards kind="actions">
                      <Button className="action-btn">Claim</Button>
                    </StyledElementForRewards>
                  </StyledElementForRewards>
                  <StyledDivForSeparator />
                </>
              )}
              {!__POOL_REWARDS_ENABLED__ && (
                <StyledDivForRewardsPlaceholder>
                  <Text color="secondary" variant="body">
                    Work in progress. Stay tuned!
                  </Text>
                </StyledDivForRewardsPlaceholder>
              )}
            </>

            {__POOL_REWARDS_ENABLED__ && (
              <>
                <Text
                  css={{ padding: '$12 0 $9', fontWeight: '$bold' }}
                  color="body"
                >
                  Unbonding Liquidity
                </Text>
                <StyledElementForUnbonding kind="list">
                  <UnbondingLiquidityCard />
                  <UnbondingLiquidityCard />
                  <UnbondingLiquidityCard />
                </StyledElementForUnbonding>
              </>
            )}
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

const StyledDivForSeparator = styled('hr', {
  margin: '0 auto',
  border: 'none',
  borderTop: '1px solid rgba(25, 29, 32, 0.1)',
  width: '100%',
  boxSizing: 'border-box',
  height: 1,
})

const StyledTextForTokens = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  alignItems: 'center',

  variants: {
    kind: {
      element: {
        columnGap: '6px',
      },
      wrapper: {
        columnGap: '23px',
      },
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
})

const StyledDivForCards = styled('div', {
  display: 'grid',
  columnGap: '$8',
  gridTemplateColumns: '1fr 1fr',
})

const StyledElementForRewards = styled('div', {
  variants: {
    kind: {
      wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 0',
      },
      tokens: {
        display: 'grid',
        columnGap: '32px',
        gridAutoFlow: 'column',
        alignItems: 'center',
      },
      column: {},
      actions: {
        '& .action-btn': {
          padding: '6px 32px',
          borderRadius: '8px',
        },
      },
    },
  },
})

const StyledElementForUnbonding = styled('div', {
  variants: {
    kind: {
      list: {
        display: 'grid',
        rowGap: '8px',
        paddingBottom: 24,
      },
    },
  },
})

const StyledDivForRewardsPlaceholder = styled('div', {
  padding: '22px 24px',
  borderRadius: '8px',
  border: '1px solid #E7E7E7',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
})

const StyledDivForSpinner = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 143,
})
