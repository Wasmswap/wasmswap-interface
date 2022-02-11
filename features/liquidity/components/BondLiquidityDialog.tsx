import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { Text } from 'components/Text'
import { LiquidityInputSelector } from './LiquidityInputSelector'
import React, { useEffect, useRef, useState } from 'react'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from 'util/conversion'
import { PercentageSelection } from './PercentageSelection'
import { StakingSummary } from './StakingSummary'
import { Divider } from 'components/Divider'
import { Column } from 'components/Column'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { StateSwitchButtons } from './StateSwitchButtons'
import { useUpdateEffect } from '@reach/utils'
import dayjs from 'dayjs'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogButtons,
} from 'components/Dialog'
import { Button } from 'components/Button'
import { useBondTokens, useUnbondTokens } from 'hooks/useBondTokens'
import { useGetPoolTokensDollarValue, useStakedTokenBalance } from '../hooks'
import { Spinner } from 'components/Spinner'
import { toast } from 'react-hot-toast'
import { Toast } from 'components/Toast'
import { IconWrapper } from 'components/IconWrapper'
import { Valid } from 'icons/Valid'
import { Error } from 'icons/Error'
import { UpRightArrow } from 'icons/UpRightArrow'
import { useRefetchQueries } from 'hooks/useRefetchQueries'

export const BondLiquidityDialog = ({ isShowing, onRequestClose, poolId }) => {
  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')

  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(poolId)

  const [{ myLiquidity } = {} as any] = usePoolLiquidity({ poolId })
  const [stakedAmount] = useStakedTokenBalance({ poolId })

  const maxLiquidityTokenAmount =
    dialogState === 'stake' ? myLiquidity?.coins ?? 0 : stakedAmount ?? 0

  const [tokenAmount, setTokenAmount] = useState(0)

  const [maxDollarValueLiquidity] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: maxLiquidityTokenAmount,
  })

  const [liquidityDollarAmount] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: tokenAmount,
  })

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
          body={(error as any)?.message ?? error?.toString()}
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
            body={(error as any)?.message ?? error?.toString()}
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
    if (dialogState === 'stake') {
      bondTokens(tokenAmount)
    } else {
      unbondTokens(tokenAmount)
    }
  }

  const canManageStaking = Boolean(stakedAmount > 0)

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
            Manage staking
          </Text>
        ) : (
          <>
            <Text variant="header" css={{ paddingBottom: '$2' }}>
              Staking tokens
            </Text>
            <Text variant="body" css={{ paddingBottom: '$10' }}>
              Choose how many tokens to stake
            </Text>
          </>
        )}
      </DialogHeader>

      {canManageStaking && (
        <>
          <DialogContent css={{ paddingBottom: '$8' }}>
            <StateSwitchButtons
              activeValue={dialogState === 'stake' ? 'staking' : 'unstaking'}
              values={['staking', 'unstaking']}
              onStateChange={(value) => {
                setDialogState(value === 'staking' ? 'stake' : 'unstake')
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
          Max available for {dialogState === 'stake' ? 'staking' : 'unstaking'}{' '}
          is worth $
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
          label={dialogState === 'stake' ? 'Staking' : 'Unstaking'}
          poolId={poolId}
          tokenA={tokenA}
          tokenB={tokenB}
          maxLiquidity={maxLiquidityTokenAmount}
          liquidityAmount={tokenAmount}
          onChangeLiquidity={setTokenAmount}
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
              ? "There'll be 14 days from the time you decide to unbond your tokens, to the time you can redeem your previous stake."
              : `Because of the 14 days unstaking period, you will be able to redeem your $${
                  typeof liquidityDollarAmount === 'number' &&
                  dollarValueFormatter(liquidityDollarAmount, {
                    includeCommaSeparation: true,
                  })
                } worth of staked token on ${dayjs()
                  .add(14, 'day')
                  .format('MMM D')}.`}
          </Text>
        </Column>
      </DialogContent>
      <DialogButtons>
        <Button variant="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAction} disabled={isLoading}>
          {isLoading ? (
            <Spinner instant />
          ) : dialogState === 'stake' ? (
            'Stake'
          ) : (
            'Unstake'
          )}
        </Button>
      </DialogButtons>
    </Dialog>
  )
}
