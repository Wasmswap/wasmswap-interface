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
import { NavigationSidebar } from 'components/Layout/NavigationSidebar'
import { RewardsStatus } from 'features/liquidity/components/RewardsStatus'
import { UnbondingLiquidityStatusList } from 'features/liquidity/components/UnbondingLiquidityStatusList'
import { LiquidityHeader } from 'features/liquidity/components/LiquidityHeader'
import { LiquidityBreakdown } from 'features/liquidity/components/LiquidityBreakdown'
import { BondLiquidityDialog } from 'features/liquidity'
import {
  ManageBondedLiquidityCard,
  ManagePoolDialog,
  ManageLiquidityCard,
} from 'features/liquidity'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useMedia } from 'hooks/useMedia'
import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
  APP_NAME,
} from 'util/constants'
import {
  useGetPoolTokensDollarValue,
  useStakedTokenBalance,
} from 'features/liquidity/hooks'
import { LiquidityRewardsCard } from 'features/liquidity/components/LiquidityRewardsCard'

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

  const [stakedBalanceCoins] = useStakedTokenBalance({
    poolId: pool,
  })

  const [stakedBalanceInDollarValue] = useGetPoolTokensDollarValue({
    poolId: pool,
    tokenAmountInMicroDenom: stakedBalanceCoins,
  })

  const stakedBalance = {
    coins: stakedBalanceCoins,
    dollarValue: stakedBalanceInDollarValue,
  }

  const [
    { totalLiquidity, myLiquidity, myReserve, tokenDollarValue } = {} as any,
    isLoading,
  ] = usePoolLiquidity({ poolId: pool })

  const isLoadingInitial = !totalLiquidity || (!totalLiquidity && isLoading)
  const supportsIncentives = Boolean(
    __POOL_STAKING_ENABLED__ && tokenB?.staking_address
  )

  if (!tokenB || !pool) return null

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

      {__POOL_STAKING_ENABLED__ && (
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
                  onClick={() =>
                    setManageLiquidityDialogState({
                      isShowing: true,
                      actionType: 'add',
                    })
                  }
                />
                <ManageBondedLiquidityCard
                  onClick={() => setIsBondingDialogShowing(true)}
                  myLiquidity={myLiquidity}
                  tokenASymbol={tokenA.symbol}
                  tokenBSymbol={tokenB.symbol}
                  stakedBalance={stakedBalance}
                  supportsIncentives={supportsIncentives}
                />
                <LiquidityRewardsCard
                  onClick={() => console.log('Test')}
                  hasBondedLiquidity={stakedBalance.coins > 0}
                  hasProvidedLiquidity={myLiquidity?.coins > 0}
                  tokenASymbol={tokenA.symbol}
                  tokenBSymbol={tokenB.symbol}
                />
              </StyledDivForCards>
            </>
            <>
              {supportsIncentives && (
                <>
                  <RewardsStatus
                    tokenA={tokenA}
                    tokenB={tokenB}
                    size={isMobile ? 'small' : 'large'}
                    disabled={!__POOL_REWARDS_ENABLED__}
                  />
                  <UnbondingLiquidityStatusList
                    poolId={pool as string}
                    tokenA={tokenA}
                    tokenB={tokenB}
                    size={isMobile ? 'small' : 'large'}
                  />
                </>
              )}
              {/* disabled state */}
              {!supportsIncentives && (
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
  gridTemplateColumns: '1fr 1fr 1fr',
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
