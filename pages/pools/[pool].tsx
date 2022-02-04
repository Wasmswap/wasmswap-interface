import React, { useState } from 'react'
import { media, styled } from 'components/theme'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppLayout } from 'components/Layout/AppLayout'
import { Button } from 'components/Button'
import { Spinner } from 'components/Spinner'
import { ChevronIcon } from 'icons/Chevron'
import { Divider } from 'components/Divider'
import { Column } from 'components/Column'
import { NavigationSidebar } from 'components/Layout/NavigationSidebar'
import { RewardsStatus } from 'features/liquidity/components/RewardsStatus'
import { UnbondingStatus } from 'features/liquidity/components/UnbondingStatus'
import { LiquidityHeader } from 'features/liquidity/components/LiquidityHeader'
import { LiquidityBreakdown } from 'features/liquidity/components/LiquidityBreakdown'
import { BondLiquidityDialog } from 'features/liquidity'
import {
  ManageBondedLiquidityCard,
  UnbondingLiquidityCard,
  ManagePoolDialog,
  ManageLiquidityCard,
} from 'features/liquidity'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useMedia } from 'hooks/useMedia'
import { __POOL_REWARDS_ENABLED__, APP_NAME } from 'util/constants'

export default function Pool() {
  const {
    query: { pool },
  } = useRouter()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })

  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const isMobile = useMedia('sm')

  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(pool as string)

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

      <AppLayout
        navigationSidebar={
          <NavigationSidebar
            shouldRenderBackButton={isMobile}
            backButton={
              <Link href="/pools" passHref>
                <Button as="a" variant="ghost" icon={<ChevronIcon />} />
              </Link>
            }
          />
        }
      >
        <LiquidityHeader
          tokenA={tokenA}
          tokenB={tokenB}
          size={isMobile ? 'small' : 'large'}
        />

        {!isMobile && <Divider />}

        {isLoadingInitial && (
          <StyledDivForSpinner>
            <Spinner color="black" size={32} />
          </StyledDivForSpinner>
        )}

        {!isLoadingInitial && (
          <>
            <LiquidityBreakdown
              tokenA={tokenA}
              tokenB={tokenB}
              totalLiquidity={totalLiquidity}
              size={isMobile ? 'small' : 'large'}
            />
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
                  <RewardsStatus
                    tokenA={tokenA}
                    tokenB={tokenB}
                    size={isMobile ? 'small' : 'large'}
                  />
                  <UnbondingStatus
                    tokenA={tokenA}
                    tokenB={tokenB}
                    size={isMobile ? 'small' : 'large'}
                  />
                  <Column gap={6}>
                    <UnbondingLiquidityCard
                      tokenA={tokenA}
                      tokenB={tokenB}
                      size={isMobile ? 'small' : 'large'}
                    />
                    <UnbondingLiquidityCard
                      tokenA={tokenA}
                      tokenB={tokenB}
                      size={isMobile ? 'small' : 'large'}
                    />
                    <UnbondingLiquidityCard
                      tokenA={tokenA}
                      tokenB={tokenB}
                      size={isMobile ? 'small' : 'large'}
                    />
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

const StyledDivForCards = styled('div', {
  display: 'grid',
  columnGap: '$8',
  gridTemplateColumns: '1fr 1fr',
  [media.sm]: {
    gridTemplateColumns: '1fr',
    rowGap: '$8',
  },
})

const StyledDivForSpinner = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 143,
})
