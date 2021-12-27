import { getBaseToken, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { Dialog, StyledCloseIcon } from 'components/Dialog'
import { Text } from 'components/Text'
import { styled } from '@stitches/react'
import { LiquidityInputSelector } from './LiquidityInputSelector'
import { useState } from 'react'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
} from 'util/conversion'
import { PercentageSelection } from './PercentageSelection'
import { StakingSummary } from './StakingSummary'
import { Divider } from './Divider'
import { DialogFooter } from './DialogFooter'
import { SecondaryButton } from './SecondaryButton'
import { PrimaryButton } from './PrimaryButton'
import { usePoolLiquidity } from 'hooks/usePoolLiquidity'
import { StateSwitchButtons } from './StateSwitchButtons'
import dayjs from 'dayjs'

export const BondLiquidityDialog = ({ isShowing, onRequestClose, poolId }) => {
  const baseToken = getBaseToken()
  const tokenInfo = useTokenInfoByPoolId(poolId)

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
    <Dialog kind="blank" isShowing={isShowing} onRequestClose={onRequestClose}>
      <StyledCloseIcon onClick={onRequestClose} offset={19} size="16px" />

      <StyledDivForContent>
        {canManageStaking ? (
          <Text type="heading" variant="bold" paddingBottom="16px">
            Manage staking
          </Text>
        ) : (
          <>
            <Text type="heading" variant="bold" paddingBottom="4px">
              Staking tokens
            </Text>
            <Text variant="light" paddingBottom="20px">
              Choose how many tokens to stake
            </Text>
          </>
        )}
      </StyledDivForContent>

      {canManageStaking && (
        <>
          <StyledDivForContent kind="stakingHeader">
            <StateSwitchButtons
              activeValue={dialogState === 'stake' ? 'staking' : 'unstaking'}
              values={['staking', 'unstaking']}
              onStateChange={(value) => {
                setDialogState(value === 'staking' ? 'stake' : 'unstake')
              }}
            />
          </StyledDivForContent>
          <Divider />
          <StyledDivForContent>
            <Text type="caption" paddingTop="16px" paddingBottom="12px">
              Choose your token amount
            </Text>
          </StyledDivForContent>
        </>
      )}
      <StyledDivForContent kind="form">
        <LiquidityInputSelector
          maxLiquidity={maxDollarValueLiquidity}
          liquidity={liquidityDollarAmount}
          onChangeLiquidity={(value) => setLiquidityDollarAmount(value)}
        />
        <Text
          type="microscopic"
          color="tertiaryText"
          paddingTop="12px"
          paddingBottom="18px"
        >
          Max available for stacking is worth $
          {dollarValueFormatterWithDecimals(maxDollarValueLiquidity)}
        </Text>
        <PercentageSelection
          maxLiquidity={maxDollarValueLiquidity}
          liquidity={liquidityDollarAmount}
          onChangeLiquidity={setLiquidityDollarAmount}
        />
      </StyledDivForContent>
      <Divider />
      <StyledDivForContent>
        <StakingSummary
          label="Staking"
          tokenA={baseToken}
          tokenB={tokenInfo}
          maxLiquidity={maxDollarValueLiquidity}
          liquidityAmount={liquidityDollarAmount}
          onChangeLiquidity={setLiquidityDollarAmount}
        />
      </StyledDivForContent>
      <Divider />
      <StyledDivForContent>
        <DialogFooter
          title={
            dialogState === 'stake'
              ? 'Unbonding Period: 14 days'
              : `Available on: ${dayjs().add(14, 'day').format('MMMM D YYYY')}`
          }
          text={
            dialogState === 'stake'
              ? "There'll be 14 days from the time you decide to unbond your tokens, to the time you can redeem your previous stake."
              : `Because of the 14 days unstaking period, you will be able to redeem your $${dollarValueFormatter(
                  liquidityDollarAmount,
                  true
                )} worth of staked token on ${dayjs()
                  .add(14, 'day')
                  .format('MMM D')}.`
          }
          buttons={
            <>
              <SecondaryButton>Cancel</SecondaryButton>
              <PrimaryButton>
                {dialogState === 'stake' ? 'Stake' : 'Unstake'}
              </PrimaryButton>
            </>
          }
        />
      </StyledDivForContent>
    </Dialog>
  )
}

const StyledDivForContent = styled('div', {
  padding: '0px 28px',
  variants: {
    kind: {
      form: {
        paddingBottom: 24,
      },
      stakingHeader: {
        paddingBottom: 16,
      },
    },
  },
})
