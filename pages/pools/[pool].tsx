import React, { useState } from 'react'
import { media, styled } from 'theme'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Button,
  Spinner,
  Divider,
  AppLayout,
  NavigationSidebar,
  IconWrapper,
  Toast,
} from 'components'
import { ChevronIcon } from 'icons/Chevron'
import {
  UnbondingLiquidityStatusList,
  LiquidityHeader,
  LiquidityBreakdown,
  LiquidityRewardsCard,
  BondLiquidityDialog,
  ManageBondedLiquidityCard,
  ManagePoolDialog,
  ManageLiquidityCard,
} from 'features/liquidity'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useMedia } from 'hooks/useMedia'
import { __POOL_STAKING_ENABLED__, APP_NAME } from 'util/constants'
import {
  useClaimRewards,
  usePendingRewards,
  useRewardsInfo,
} from '../../hooks/useRewardsQueries'
import { useRefetchQueries } from '../../hooks/useRefetchQueries'
import { toast } from 'react-hot-toast'
import { Error } from '../../icons/Error'
import { formatSdkErrorMessage } from '../../util/formatSdkErrorMessage'
import { UpRightArrow } from '../../icons/UpRightArrow'

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
    {
      totalLiquidity,
      myLiquidity,
      myReserve,
      tokenDollarValue,
      myStakedLiquidity,
      rewardsInfo,
    } = {} as any,
    isLoading,
  ] = usePoolLiquidity({ poolId: pool })

  const [rewardsContracts] = useRewardsInfo({
    swapAddress: tokenB?.swap_address,
  })

  const [pendingRewards] = usePendingRewards({
    swapAddress: tokenB?.swap_address,
  })

  const isLoadingInitial = isLoading && !totalLiquidity

  const supportsIncentives = Boolean(
    __POOL_STAKING_ENABLED__ && tokenB?.staking_address
  )

  const refetchQueries = useRefetchQueries([
    'myLiquidity',
    'stakedTokenBalance',
    'pendingRewards',
  ])

  const { mutate: mutateClaimRewards, isLoading: isClaimingRewards } =
    useClaimRewards({
      swapAddress: tokenB?.swap_address,
      onSuccess() {
        refetchQueries()
      },
      onError(e) {
        console.error(e)

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Error />} color="error" />}
            title={"Couldn't claim your rewards"}
            body={formatSdkErrorMessage(e)}
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
              poolId={pool}
              tokenA={tokenA}
              tokenB={tokenB}
              totalLiquidity={totalLiquidity}
              rewardsInfo={rewardsInfo}
              rewardsContracts={rewardsContracts}
              size={isMobile ? 'small' : 'large'}
            />
            <>
              <StyledDivForCards>
                <ManageLiquidityCard
                  myReserve={myReserve}
                  tokenDollarValue={tokenDollarValue}
                  tokenASymbol={tokenA.symbol}
                  tokenBSymbol={tokenB.symbol}
                  stakedBalance={myStakedLiquidity.tokenAmount}
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
                  rewardsContracts={rewardsContracts}
                  stakedBalance={myStakedLiquidity}
                  rewardsInfo={rewardsInfo}
                  supportsIncentives={supportsIncentives}
                />
                <LiquidityRewardsCard
                  onClick={mutateClaimRewards}
                  hasBondedLiquidity={myStakedLiquidity.tokenAmount > 0}
                  hasProvidedLiquidity={myLiquidity?.tokenAmount > 0}
                  pendingRewards={pendingRewards}
                  loading={isClaimingRewards}
                />
              </StyledDivForCards>
            </>
            <>
              {supportsIncentives && (
                <UnbondingLiquidityStatusList
                  poolId={pool as string}
                  tokenA={tokenA}
                  tokenB={tokenB}
                  size={isMobile ? 'small' : 'large'}
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
