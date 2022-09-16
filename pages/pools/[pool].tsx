import { AppLayout, NavigationSidebar } from 'components'
import {
  BondLiquidityDialog,
  LiquidityBreakdown,
  LiquidityRewardsCard,
  ManageBondedLiquidityCard,
  ManageLiquidityCard,
  ManagePoolDialog,
  UnbondingLiquidityStatusList,
} from 'features/liquidity'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useClaimRewards, usePendingRewards } from 'hooks/useRewardsQueries'
import {
  Button,
  ChevronIcon,
  Column,
  Error,
  IconWrapper,
  Inline,
  media,
  Spinner,
  styled,
  Text,
  Toast,
  UpRightArrow,
  useMedia,
  Valid,
} from 'junoblocks'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQueryPoolLiquidity } from 'queries/useQueryPools'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  __POOL_REWARDS_ENABLED__,
  __POOL_STAKING_ENABLED__,
  APP_NAME,
} from 'util/constants'
import { formatSdkErrorMessage } from 'util/formatSdkErrorMessage'

export default function Pool() {
  const {
    query: { pool: poolId },
  } = useRouter()

  const [
    { isShowing: isManageLiquidityDialogShowing, actionType },
    setManageLiquidityDialogState,
  ] = useState({ isShowing: false, actionType: 'add' as 'add' | 'remove' })

  const [isBondingDialogShowing, setIsBondingDialogShowing] = useState(false)

  const isMobile = useMedia('sm')
  const [pool, isLoading, isError] = useQueryPoolLiquidity({ poolId })

  const [pendingRewards] = usePendingRewards({
    pool,
  })

  const isLoadingInitial = isLoading && !pool

  const supportsIncentives = Boolean(
    __POOL_STAKING_ENABLED__ &&
      __POOL_REWARDS_ENABLED__ &&
      pool?.staking_address
  )

  const refetchQueries = useRefetchQueries(['@liquidity', 'pendingRewards'])

  const { mutate: mutateClaimRewards, isLoading: isClaimingRewards } =
    useClaimRewards({
      pool,
      onSuccess() {
        refetchQueries()

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title="Rewards were successfully claimed!"
            onClose={() => toast.dismiss(t.id)}
          />
        ))
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

  if (!pool || !poolId) {
    return (
      <Inline
        align="center"
        justifyContent="center"
        css={{ padding: '$10', height: '100vh' }}
      >
        {isError ? (
          <Text variant="header">
            {"Oops, we've messed up. Please try again later."}
          </Text>
        ) : (
          <Spinner color="primary" />
        )}
      </Inline>
    )
  }

  const [tokenA, tokenB] = pool.pool_assets

  return (
    <>
      <ManagePoolDialog
        isShowing={isManageLiquidityDialogShowing}
        initialActionType={actionType}
        onRequestClose={() =>
          setManageLiquidityDialogState({
            isShowing: false,
            actionType: 'add',
          })
        }
        poolId={poolId as string}
      />

      {__POOL_STAKING_ENABLED__ && (
        <BondLiquidityDialog
          isShowing={isBondingDialogShowing}
          onRequestClose={() => setIsBondingDialogShowing(false)}
          poolId={poolId as string}
        />
      )}

      {pool && (
        <Head>
          <title>
            {APP_NAME} — Pool {tokenA.symbol}/{tokenB.symbol}
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
        {isLoadingInitial && (
          <StyledDivForSpinner>
            <Spinner color="primary" size={32} />
          </StyledDivForSpinner>
        )}

        {!isLoadingInitial && (
          <>
            <LiquidityBreakdown
              poolId={poolId as string}
              tokenA={tokenA}
              tokenB={tokenB}
              totalLiquidity={pool.liquidity.available.total}
              yieldPercentageReturn={
                pool.liquidity.rewards.annualYieldPercentageReturn
              }
              lpFee={pool.swap_info.lp_fee_percent}
              protocolFee={pool.swap_info.protocol_fee_percent}
              rewardsContracts={pool.liquidity.rewards.contracts}
              size={isMobile ? 'small' : 'large'}
            />
            <>
              <StyledDivForCards>
                <Column
                  style={{ flexBasis: '0px', flexGrow: 1, flexShrink: 1 }}
                >
                  <ManageLiquidityCard
                    providedLiquidityReserve={pool.liquidity.reserves.provided}
                    providedLiquidity={pool.liquidity.available.provided}
                    stakedLiquidityReserve={
                      pool.liquidity.reserves.providedStaked
                    }
                    providedTotalLiquidity={pool.liquidity.providedTotal}
                    stakedLiquidity={pool.liquidity.staked}
                    tokenASymbol={tokenA.symbol}
                    tokenBSymbol={tokenB.symbol}
                    supportsIncentives={supportsIncentives}
                    onClick={() =>
                      setManageLiquidityDialogState({
                        isShowing: true,
                        actionType: 'add',
                      })
                    }
                  />
                </Column>
                <Column css={{ flexBasis: '0px', flexGrow: 1, flexShrink: 1 }}>
                  <ManageBondedLiquidityCard
                    onClick={() => setIsBondingDialogShowing(true)}
                    providedLiquidity={pool.liquidity.available.provided}
                    stakedLiquidity={pool.liquidity.staked.provided}
                    yieldPercentageReturn={
                      pool.liquidity.rewards.annualYieldPercentageReturn
                    }
                    supportsIncentives={supportsIncentives}
                  />
                </Column>
              </StyledDivForCards>
              <Column css={{ marginTop: '$6' }}>
                <LiquidityRewardsCard
                  onClick={mutateClaimRewards}
                  hasBondedLiquidity={
                    pool.liquidity.staked.provided.tokenAmount > 0
                  }
                  hasProvidedLiquidity={
                    pool.liquidity.available.provided.tokenAmount > 0
                  }
                  pendingRewards={pendingRewards}
                  loading={isClaimingRewards}
                  supportsIncentives={supportsIncentives}
                />
              </Column>
            </>
            <>
              {supportsIncentives && (
                <UnbondingLiquidityStatusList
                  poolId={poolId as string}
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
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '$8',
  alignItems: 'stretch',
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
