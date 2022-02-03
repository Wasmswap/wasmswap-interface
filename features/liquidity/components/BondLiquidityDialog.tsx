import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { Text } from 'components/Text'
import { LiquidityInputSelector } from './LiquidityInputSelector'
import { useEffect, useState } from 'react'
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
import dayjs from 'dayjs'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogButtons,
} from 'components/Dialog'
import { Button } from 'components/Button'
import { useBondTokens, useUnbondTokens } from '../../../hooks/useBondTokens'
import {
  useGetPoolTokensDollarValue,
  useStakedTokenBalance,
} from '../../../hooks/useStakedToken'
import { Spinner } from '../../../components/Spinner'

export const BondLiquidityDialog = ({ isShowing, onRequestClose, poolId }) => {
  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')

  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(poolId)

  const [{ myLiquidity } = {} as any] = usePoolLiquidity({ poolId })
  const [stakedAmount] = useStakedTokenBalance({ poolId })

  const maxLiquidityTokenAmount =
    dialogState === 'stake' ? myLiquidity?.coins ?? 0 : stakedAmount ?? 0

  const [tokenAmount, setTokenAmount] = useState(0)
  // todo reset cache & show toasts
  const { mutate: bondTokens, isLoading: isRequestingToBond } = useBondTokens({
    poolId,
  })
  // todo reset cache & show toasts
  const { mutate: unbondTokens, isLoading: isRequestingToUnbond } =
    useUnbondTokens({ poolId })

  const isLoading = isRequestingToBond || isRequestingToUnbond

  const handleAction = () => {
    if (dialogState === 'stake') {
      bondTokens(tokenAmount)
    } else {
      unbondTokens(tokenAmount)
    }
  }

  const [maxDollarValueLiquidity] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: maxLiquidityTokenAmount,
  })

  const [liquidityDollarAmount] = useGetPoolTokensDollarValue({
    poolId,
    tokenAmountInMicroDenom: tokenAmount,
  })

  const canManageStaking = stakedAmount > 0

  useEffect(() => {
    const shouldResetDialogState =
      !canManageStaking && dialogState === 'unstake'
    if (shouldResetDialogState) setDialogState('stake')
  }, [canManageStaking, dialogState])

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
                setTokenAmount(0)
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
          maxLiquidity={maxLiquidityTokenAmount}
          liquidity={tokenAmount}
          onChangeLiquidity={setTokenAmount}
        />
        <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
          Max available for stacking is worth $
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
