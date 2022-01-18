import React, { useState } from 'react'
import { styled } from 'components/theme'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLayout } from 'components/Layout/AppLayout'
import { Text } from 'components/Text'
import { Chevron } from 'icons/Chevron'
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
import { parseCurrency } from 'features/liquidity/components/PoolCard'
import { __POOL_REWARDS_ENABLED__, APP_NAME } from 'util/constants'
import { BondLiquidityDialog } from 'features/liquidity'
import { Spinner } from 'components/Spinner'

export default function Pool() {
  const {
    query: { pool },
  } = useRouter()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })
  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const tokenInfo = useTokenInfoByPoolId(pool as string)
  const baseToken = useBaseTokenInfo()

  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: baseToken?.symbol,
    tokenBSymbol: tokenInfo?.symbol,
    tokenAmount: 1,
  })

  const [
    { totalLiquidity, myLiquidity, myReserve, tokenDollarValue } = {} as any,
    isLoading,
  ] = usePoolLiquidity({ poolId: pool })

  const isLoadingInitial = !totalLiquidity || (!totalLiquidity && isLoading)

  if (!tokenInfo || !pool) {
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
            {APP_NAME} — Pool {tokenInfo.pool_id}
          </title>
        </Head>
      )}

      <AppLayout>
        <StyledWrapperForNavigation>
          <StyledNavElement position="left">
            <Link href="/pools" passHref>
              <Button
                icon={<IconWrapper icon={<Chevron />} />}
                variant="ghost"
                as="a"
              />
            </Link>
          </StyledNavElement>
          <StyledNavElement position="center">
            <Text variant="header" transform="capitalize">
              Pool {baseToken.name} + {tokenInfo.name}
            </Text>
          </StyledNavElement>
        </StyledWrapperForNavigation>

        <StyledDivForSeparator />

        {isLoadingInitial && (
          <StyledDivForSpinner>
            <Spinner color="black" size={32} />
          </StyledDivForSpinner>
        )}

        {!isLoadingInitial && (
          <>
            <StyledRowForTokensInfo kind="wrapper">
              <StyledRowForTokensInfo kind="column">
                <Text css={{ paddingRight: '$13' }}>
                  Pool #{tokenInfo.pool_id}
                </Text>
                <StyledTextForTokens kind="wrapper">
                  <StyledTextForTokens kind="element">
                    <StyledImageForToken src="https://junochain.com/assets/logos/logo_512x512.png" />
                    <Text color="body" variant="caption">
                      {baseToken.symbol}
                    </Text>
                  </StyledTextForTokens>
                  <StyledTextForTokens kind="element">
                    <StyledImageForToken
                      as={tokenInfo.logoURI ? 'img' : 'div'}
                      src={tokenInfo.logoURI}
                    />
                    <Text color="body" variant="caption">
                      {tokenInfo.symbol}
                    </Text>
                  </StyledTextForTokens>
                </StyledTextForTokens>
              </StyledRowForTokensInfo>
              <StyledRowForTokensInfo kind="column">
                <Text variant="caption" color="tertiary" transform="lowercase">
                  {isPriceLoading
                    ? ''
                    : `1 ${baseToken.symbol} = ${tokenPrice} ${tokenInfo.symbol}`}
                </Text>
              </StyledRowForTokensInfo>
            </StyledRowForTokensInfo>

            <StyledDivForSeparator />

            <StyledElementForLiquidity kind="wrapper">
              <StyledElementForLiquidity kind="row">
                <Text
                  variant="body"
                  color="secondary"
                  css={{ paddingBottom: '$3' }}
                >
                  Total Liquidity
                </Text>
                <Text
                  variant="body"
                  color="secondary"
                  css={{ paddingBottom: '$3' }}
                >
                  APR reward
                </Text>
              </StyledElementForLiquidity>
              <StyledElementForLiquidity kind="row">
                <Text variant="header">
                  {parseCurrency(totalLiquidity?.dollarValue)}
                </Text>
                <Text variant="header">0%</Text>
              </StyledElementForLiquidity>
            </StyledElementForLiquidity>

            <StyledDivForSeparator />

            <>
              <Text css={{ padding: '$12 0 $9' }} variant="primary">
                Personal shares
              </Text>
              <StyledDivForCards>
                <ManageLiquidityCard
                  myReserve={myReserve}
                  tokenDollarValue={tokenDollarValue}
                  tokenASymbol={baseToken.symbol}
                  tokenBSymbol={tokenInfo.symbol}
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
                  tokenASymbol={baseToken.symbol}
                  tokenBSymbol={tokenInfo.symbol}
                />
              </StyledDivForCards>
            </>

            <>
              <Text variant="primary" css={{ padding: '$12 0 $9' }}>
                Rewards
              </Text>
              {__POOL_REWARDS_ENABLED__ && (
                <>
                  <StyledDivForSeparator />
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
  padding: '$12 0',
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

const StyledRowForTokensInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  variants: {
    kind: {
      wrapper: {
        padding: '$7 0',
        justifyContent: 'space-between',
      },
      column: {},
    },
  },
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

const StyledElementForLiquidity = styled('div', {
  variants: {
    kind: {
      wrapper: {
        paddingTop: 22,
        paddingBottom: 28,
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
  },
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
