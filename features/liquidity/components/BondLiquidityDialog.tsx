import dayjs from 'dayjs'
import { useBondTokens, useUnbondTokens } from 'hooks/useBondTokens'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import {
  Button,
  Column,
  Dialog,
  DialogButtons,
  DialogContent,
  DialogHeader,
  Divider,
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  Error,
  IconWrapper,
  Spinner,
  Text,
  Toast,
  UpRightArrow,
  Valid,
} from 'junoblocks'
import { useQueryPoolLiquidity } from 'queries/useQueryPools'
import { useQueryPoolUnstakingDuration } from 'queries/useQueryPoolUnstakingDuration'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useUpdateEffect } from 'react-use'
import { formatSdkErrorMessage } from 'util/formatSdkErrorMessage'

import { LiquidityInputSelector } from './LiquidityInputSelector'
import { PercentageSelection } from './PercentageSelection'
import { StakingSummary } from './StakingSummary'
import { StateSwitchButtons } from './StateSwitchButtons'

type BondLiquidityDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  poolId: string
}

export const BondLiquidityDialog = ({
  isShowing,
  onRequestClose,
  poolId,
}: BondLiquidityDialogProps) => {
  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')

  const [pool] = useQueryPoolLiquidity({
    poolId,
  })

  const { data: unstakingDuration } = useQueryPoolUnstakingDuration({
    poolId,
  })

  const { pool_assets, liquidity } = pool || {}
  const [tokenA, tokenB] = pool_assets || []

  const totalLiquidityProvidedTokenAmount =
    dialogState === 'stake'
      ? liquidity?.available.provided.tokenAmount ?? 0
      : liquidity?.staked.provided.tokenAmount ?? 0

  const totalLiquidityProvidedDollarValue =
    dialogState === 'stake'
      ? liquidity?.available.provided.dollarValue ?? 0
      : liquidity?.staked.provided.dollarValue ?? 0

  const [tokenAmount, setTokenAmount] = useState(0)

  const liquidityDollarAmount =
    (tokenAmount / totalLiquidityProvidedTokenAmount) *
    totalLiquidityProvidedDollarValue

  const refetchQueries = useRefetchQueries([
    'tokenBalance',
    `@pool-liquidity/${pool.pool_id}`,
    'stakedTokenBalance',
    'claimTokens',
  ])

  const { mutate: bondTokens, isLoading: isRequestingToBond } = useBondTokens({
    poolId,

    onSuccess() {
      // reset cache
      refetchQueries()

      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Valid />} color="valid" />}
          title={`Successfully bonded $${dollarValueFormatterWithDecimals(
            liquidityDollarAmount as number,
            { includeCommaSeparation: true }
          )}`}
          onClose={() => toast.dismiss(t.id)}
        />
      ))

      // close modal
      requestAnimationFrame(onRequestClose)
    },
    onError(error) {
      toast.custom((t) => (
        <Toast
          icon={<IconWrapper icon={<Error />} color="error" />}
          title={`Couldn't bond your $${dollarValueFormatterWithDecimals(
            liquidityDollarAmount as number,
            { includeCommaSeparation: true }
          )}`}
          body={formatSdkErrorMessage(error)}
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

  // todo reset cache & show toasts
  const { mutate: unbondTokens, isLoading: isRequestingToUnbond } =
    useUnbondTokens({
      poolId,

      onSuccess() {
        // reset cache
        refetchQueries()

        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title={`Unbond of $${dollarValueFormatterWithDecimals(
              liquidityDollarAmount as number,
              { includeCommaSeparation: true }
            )} successfully started!`}
            onClose={() => toast.dismiss(t.id)}
          />
        ))

        // close modal
        requestAnimationFrame(onRequestClose)
      },
      onError(error) {
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Error />} color="error" />}
            title={`Could not unbond your $${dollarValueFormatterWithDecimals(
              liquidityDollarAmount as number,
              { includeCommaSeparation: true }
            )}`}
            body={formatSdkErrorMessage(error)}
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

  const isLoading = isRequestingToBond || isRequestingToUnbond

  const handleAction = () => {
    const flooredTokenAmount = Math.floor(tokenAmount)
    if (dialogState === 'stake') {
      bondTokens(flooredTokenAmount)
    } else {
      unbondTokens(flooredTokenAmount)
    }
  }

  const getIsFormSubmissionDisabled = () => {
    if (dialogState === 'stake') {
      if (totalLiquidityProvidedTokenAmount <= 0) {
        return true
      }
    }

    if (dialogState === 'unstake') {
      if (totalLiquidityProvidedTokenAmount <= 0) {
        return true
      }
    }

    return isLoading || !tokenAmount
  }

  const canManageStaking = Boolean(liquidity?.staked.provided.tokenAmount > 0)

  useEffect(() => {
    const shouldResetDialogState =
      !canManageStaking && dialogState === 'unstake'
    if (shouldResetDialogState) setDialogState('stake')
  }, [canManageStaking, dialogState])

  useUpdateEffect(() => {
    if (isShowing) {
      setTokenAmount(0)
    }
  }, [isShowing, dialogState])

  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    if (isShowing) {
      inputRef.current?.focus()
    }
  }, [isShowing])

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader>
        {canManageStaking ? (
          <Text variant="header" css={{ paddingBottom: '$8' }}>
            Manage Bonding
          </Text>
        ) : (
          <>
            <Text variant="header" css={{ paddingBottom: '$2' }}>
              Bonding tokens
            </Text>
            <Text variant="body" css={{ paddingBottom: '$10' }}>
              Choose how many tokens to bond
            </Text>
          </>
        )}
      </DialogHeader>

      {canManageStaking && (
        <>
          <DialogContent css={{ paddingBottom: '$8' }}>
            <StateSwitchButtons
              activeValue={dialogState === 'stake' ? 'stake' : 'unstake'}
              values={['stake', 'unstake']}
              onStateChange={(value) => {
                setDialogState(value === 'stake' ? 'stake' : 'unstake')
              }}
            />
          </DialogContent>
          <Divider />
          <DialogContent>
            <Text variant="body" css={{ padding: '$8 0 $6' }}>
              Choose your token amount
            </Text>
          </DialogContent>
        </>
      )}
      <DialogContent css={{ paddingBottom: '$12' }}>
        <LiquidityInputSelector
          inputRef={inputRef}
          maxLiquidity={totalLiquidityProvidedTokenAmount}
          liquidity={tokenAmount}
          onChangeLiquidity={setTokenAmount}
        />
        <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
          Max available to {dialogState === 'stake' ? 'bond' : 'unbond'} is $
          {typeof totalLiquidityProvidedDollarValue === 'number' &&
            dollarValueFormatterWithDecimals(
              totalLiquidityProvidedDollarValue,
              {
                includeCommaSeparation: true,
              }
            )}
        </Text>
        <PercentageSelection
          maxLiquidity={totalLiquidityProvidedTokenAmount}
          liquidity={tokenAmount}
          onChangeLiquidity={setTokenAmount}
        />
      </DialogContent>
      <Divider />
      <DialogContent>
        <StakingSummary
          label={dialogState === 'stake' ? 'Bonding' : 'Unbonding'}
          poolId={poolId}
          tokenA={tokenA}
          tokenB={tokenB}
          totalLiquidityProvidedTokenAmount={totalLiquidityProvidedTokenAmount}
          totalLiquidityProvidedDollarValue={totalLiquidityProvidedDollarValue}
          liquidityAmount={tokenAmount}
          onChangeLiquidity={setTokenAmount}
          liquidityInDollarValue={liquidityDollarAmount}
        />
      </DialogContent>
      <Divider />
      <DialogContent>
        <Column>
          <Text variant="body" css={{ padding: '$8 0 $4' }}>
            {dialogState === 'stake'
              ? `Unbonding Period: ${unstakingDuration?.days} days`
              : `Available on: ${dayjs()
                  .add(unstakingDuration?.days, 'day')
                  .format('MMMM D YYYY')}`}
          </Text>

          <Text variant="secondary" css={{ paddingBottom: '$12' }}>
            {dialogState === 'stake'
              ? `There'll be ${unstakingDuration?.days} days from the time you decide to unbond your tokens, to the time you can redeem your previous unbond.`
              : `Because of the ${
                  unstakingDuration?.days
                } days unbonding period, you will be able to redeem your $${
                  typeof liquidityDollarAmount === 'number' &&
                  dollarValueFormatter(liquidityDollarAmount, {
                    includeCommaSeparation: true,
                  })
                } worth of bonded token on ${dayjs()
                  .add(unstakingDuration?.days, 'day')
                  .format('MMM D')}.`}
          </Text>
        </Column>
      </DialogContent>
      <DialogButtons
        cancellationButton={
          <Button variant="secondary" onClick={onRequestClose}>
            Cancel
          </Button>
        }
        confirmationButton={
          <Button
            variant="primary"
            onClick={handleAction}
            disabled={getIsFormSubmissionDisabled()}
          >
            {isLoading ? (
              <Spinner instant />
            ) : dialogState === 'stake' ? (
              'Bond'
            ) : (
              'Unbond'
            )}
          </Button>
        }
      />
    </Dialog>
  )
}
