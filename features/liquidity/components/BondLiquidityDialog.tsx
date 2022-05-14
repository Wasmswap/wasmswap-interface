import { useUpdateEffect } from '@reach/utils'
import dayjs from 'dayjs'
import { useBondTokens, useUnbondTokens } from 'hooks/useBondTokens'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { useRefetchQueries } from 'hooks/useRefetchQueries'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
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
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { formatSdkErrorMessage } from 'util/formatSdkErrorMessage'

import { LiquidityInputSelector } from './LiquidityInputSelector'
import { PercentageSelection } from './PercentageSelection'
import { StakingSummary } from './StakingSummary'
import { StateSwitchButtons } from './StateSwitchButtons'

export const BondLiquidityDialog = ({ isShowing, onRequestClose, poolId }) => {
  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')

  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(poolId)

  const [{ myLiquidity, myStakedLiquidity } = {} as any] = usePoolLiquidity({
    poolId,
  })

  const maxLiquidityTokenAmount =
    dialogState === 'stake'
      ? myLiquidity?.tokenAmount ?? 0
      : myStakedLiquidity?.tokenAmount ?? 0

  const maxDollarValueLiquidity =
    dialogState === 'stake'
      ? myLiquidity?.dollarValue ?? 0
      : myStakedLiquidity?.dollarValue ?? 0

  const [tokenAmount, setTokenAmount] = useState(0)

  const liquidityDollarAmount =
    (tokenAmount / maxLiquidityTokenAmount) * maxDollarValueLiquidity

  const refetchQueries = useRefetchQueries([
    'tokenBalance',
    'myLiquidity',
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
    const amountForStaking = Math.floor(tokenAmount)
    if (dialogState === 'stake') {
      bondTokens(amountForStaking)
    } else {
      unbondTokens(amountForStaking)
    }
  }

  const getIsFormSubmissionDisabled = () => {
    if (dialogState === 'stake') {
      if (maxLiquidityTokenAmount <= 0) {
        return true
      }
    }

    if (dialogState === 'unstake') {
      if (maxLiquidityTokenAmount <= 0) {
        return true
      }
    }

    return isLoading || !tokenAmount
  }

  const canManageStaking = Boolean(myStakedLiquidity?.tokenAmount > 0)

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
          maxLiquidity={maxLiquidityTokenAmount}
          liquidity={tokenAmount}
          onChangeLiquidity={setTokenAmount}
        />
        <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
          Max available to {dialogState === 'stake' ? 'bond' : 'unbond'} is $
          {typeof maxDollarValueLiquidity === 'number' &&
            dollarValueFormatterWithDecimals(maxDollarValueLiquidity, {
              includeCommaSeparation: true,
            })}
        </Text>
        <PercentageSelection
          maxLiquidity={maxLiquidityTokenAmount}
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
          maxLiquidity={maxLiquidityTokenAmount}
          liquidityAmount={tokenAmount}
          onChangeLiquidity={setTokenAmount}
          maxLiquidityInDollarValue={maxDollarValueLiquidity}
          liquidityInDollarValue={liquidityDollarAmount}
        />
      </DialogContent>
      <Divider />
      <DialogContent>
        <Column>
          <Text variant="body" css={{ padding: '$8 0 $4' }}>
            {dialogState === 'stake'
              ? 'Unbonding Period: 14 days'
              : `Available on: ${dayjs().add(14, 'day').format('MMMM D YYYY')}`}
          </Text>

          <Text variant="secondary" css={{ paddingBottom: '$12' }}>
            {dialogState === 'stake'
              ? "There'll be 14 days from the time you decide to unbond your tokens, to the time you can redeem your previous unbond."
              : `Because of the 14 days unbonding period, you will be able to redeem your $${
                  typeof liquidityDollarAmount === 'number' &&
                  dollarValueFormatter(liquidityDollarAmount, {
                    includeCommaSeparation: true,
                  })
                } worth of bonded token on ${dayjs()
                  .add(14, 'day')
                  .format('MMM D')}.`}
          </Text>
        </Column>
      </DialogContent>
      <DialogButtons>
        <Button variant="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
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
      </DialogButtons>
    </Dialog>
  )
}
