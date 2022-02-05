import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { Text } from 'components/Text'
import { LiquidityInputSelector } from './LiquidityInputSelector'
import { useState } from 'react'
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

export const BondLiquidityDialog = ({ isShowing, onRequestClose, poolId }) => {
  const tokenA = useBaseTokenInfo()
  const tokenB = useTokenInfoByPoolId(poolId)

  const [
    {
      // totalLiquidity,
      myLiquidity,
      // myReserve,
      // tokenDollarValue,
    } = {} as any,
  ] = usePoolLiquidity({ poolId })

  const maxDollarValueLiquidity = myLiquidity?.dollarValue ?? 0
  const [liquidityDollarAmount, setLiquidityDollarAmount] = useState(0)

  const [dialogState, setDialogState] = useState<'stake' | 'unstake'>('stake')
  const canManageStaking = true

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
          maxLiquidity={maxDollarValueLiquidity}
          liquidity={liquidityDollarAmount}
          onChangeLiquidity={(value) => setLiquidityDollarAmount(value)}
        />
        <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
          Max available for stacking is worth $
          {dollarValueFormatterWithDecimals(maxDollarValueLiquidity, {
            includeCommaSeparation: true,
          })}
        </Text>
        <PercentageSelection
          maxLiquidity={maxDollarValueLiquidity}
          liquidity={liquidityDollarAmount}
          onChangeLiquidity={setLiquidityDollarAmount}
        />
      </DialogContent>
      <Divider />
      <DialogContent>
        <StakingSummary
          label="Staking"
          tokenA={tokenA}
          tokenB={tokenB}
          maxLiquidity={maxDollarValueLiquidity}
          liquidityAmount={liquidityDollarAmount}
          onChangeLiquidity={setLiquidityDollarAmount}
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
              : `Because of the 14 days unstaking period, you will be able to redeem your $${dollarValueFormatter(
                  liquidityDollarAmount,
                  {
                    includeCommaSeparation: true,
                  }
                )} worth of staked token on ${dayjs()
                  .add(14, 'day')
                  .format('MMM D')}.`}
          </Text>
        </Column>
      </DialogContent>
      <DialogButtons>
        <Button variant="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button variant="primary">
          {dialogState === 'stake' ? 'Stake' : 'Unstake'}
        </Button>
      </DialogButtons>
    </Dialog>
  )
}
