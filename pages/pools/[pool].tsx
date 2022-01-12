import React, { useState } from 'react'
import { styled } from '@stitches/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLayout } from '../../components/Layout/AppLayout'
import { Text } from '../../components/Text'
import { Chevron } from '../../icons/Chevron'
import { IconWrapper } from '../../components/IconWrapper'
import {
  PoolBondedLiquidityCard,
  UnbondingLiquidityCard,
  ManagePoolDialog,
  PoolAvailableLiquidityCard,
} from '../../features/liquidity'
import { Button } from '../../components/Button'
import { getBaseToken, useTokenInfoByPoolId } from '../../hooks/useTokenInfo'
import { useTokenToTokenPrice } from '../../features/swap/hooks/useTokenToTokenPrice'
import { usePoolLiquidity } from '../../hooks/usePoolLiquidity'
import { parseCurrency } from '../../features/liquidity/components/PoolCard'
import { __POOL_REWARDS_ENABLED__ } from '../../util/constants'
import { BondLiquidityDialog } from '../../features/liquidity'
import { Spinner } from '../../components/Spinner'

export default function Pool() {
  const {
    query: { pool },
  } = useRouter()

  const [isManageLiquidityDialogShowing, setIsManageLiquidityDialogShowing] =
    useState(false)
  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const tokenInfo = useTokenInfoByPoolId(pool as string)
  const baseToken = getBaseToken()

  const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: baseToken.symbol,
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
          onRequestClose={() => setIsManageLiquidityDialogShowing(false)}
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
      <AppLayout>
        <StyledWrapperForNavigation>
          <StyledNavElement position="left">
            <Link href="/pools" passHref>
              <IconWrapper
                as="a"
                type="button"
                size="20px"
                icon={<Chevron />}
              />
            </Link>
          </StyledNavElement>
          <StyledNavElement position="center">
            <Text type="heading" textTransform="capitalize">
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
                <Text paddingRight="26px">Pool #{tokenInfo.pool_id}</Text>
                <StyledTextForTokens kind="wrapper">
                  <StyledTextForTokens kind="element">
                    <StyledImageForToken src="https://junochain.com/assets/logos/logo_512x512.png" />
                    <Text color="bodyText" type="microscopic">
                      {baseToken.symbol}
                    </Text>
                  </StyledTextForTokens>
                  <StyledTextForTokens kind="element">
                    <StyledImageForToken
                      as={tokenInfo.logoURI ? 'img' : 'div'}
                      src={tokenInfo.logoURI}
                    />
                    <Text color="bodyText" type="microscopic">
                      {tokenInfo.symbol}
                    </Text>
                  </StyledTextForTokens>
                </StyledTextForTokens>
              </StyledRowForTokensInfo>
              <StyledRowForTokensInfo kind="column">
                <Text
                  type="microscopic"
                  color="tertiaryText"
                  textTransform="lowercase"
                >
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
                  type="caption"
                  variant="light"
                  color="secondaryText"
                  paddingBottom="6px"
                >
                  Total Liquidity
                </Text>
                <Text
                  type="caption"
                  variant="light"
                  color="secondaryText"
                  paddingBottom="6px"
                >
                  APR reward
                </Text>
              </StyledElementForLiquidity>
              <StyledElementForLiquidity kind="row">
                <Text type="title3" variant="bold">
                  {parseCurrency(totalLiquidity?.dollarValue)}
                </Text>
                <Text type="title3" variant="bold">
                  0%
                </Text>
              </StyledElementForLiquidity>
            </StyledElementForLiquidity>

            <StyledDivForSeparator />

            <>
              <Text
                variant="bold"
                paddingTop="24px"
                paddingBottom="18px"
                color="bodyText"
              >
                Personal shares
              </Text>
              <StyledDivForCards>
                <PoolAvailableLiquidityCard
                  myLiquidity={myLiquidity}
                  myReserve={myReserve}
                  totalLiquidity={totalLiquidity}
                  tokenDollarValue={tokenDollarValue}
                  tokenASymbol={baseToken.symbol}
                  tokenBSymbol={tokenInfo.symbol}
                  onButtonClick={() => setIsManageLiquidityDialogShowing(true)}
                />
                <PoolBondedLiquidityCard
                  onButtonClick={() => setIsBondingDialogShowing(true)}
                  myLiquidity={myLiquidity}
                  tokenASymbol={baseToken.symbol}
                  tokenBSymbol={tokenInfo.symbol}
                />
              </StyledDivForCards>
            </>

            <>
              <Text
                variant="bold"
                paddingTop="24px"
                paddingBottom="18px"
                color="bodyText"
              >
                Rewards
              </Text>
              {__POOL_REWARDS_ENABLED__ && (
                <>
                  <StyledDivForSeparator />
                  <StyledElementForRewards kind="wrapper">
                    <StyledElementForRewards kind="column">
                      <Text type="title2">$289.00</Text>
                    </StyledElementForRewards>

                    <StyledElementForRewards kind="tokens">
                      <StyledTextForTokens kind="element">
                        <StyledImageForToken src="/crab.png" />
                        <Text color="bodyText" type="microscopic">
                          11 juno
                        </Text>
                      </StyledTextForTokens>
                      <StyledTextForTokens kind="element">
                        <StyledImageForToken src="/crab.png" />
                        <Text color="bodyText" type="microscopic">
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
                  <Text color="secondaryText" type="caption" variant="light">
                    Work in progress. Stay tuned!
                  </Text>
                </StyledDivForRewardsPlaceholder>
              )}
            </>

            {__POOL_REWARDS_ENABLED__ && (
              <>
                <Text
                  variant="bold"
                  paddingTop="24px"
                  paddingBottom="18px"
                  color="bodyText"
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
  padding: '24px 0',
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
        padding: '14px 0',
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
  columnGap: '18px',
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
