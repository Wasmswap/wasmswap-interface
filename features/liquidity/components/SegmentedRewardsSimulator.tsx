import {
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
  SegmentedControl,
  Text,
} from 'junoblocks'
import { useRef, useState } from 'react'

type SegmentedRewardsSimulatorProps = {
  interestOnStakedBalance: number
  stakedLiquidityDollarValue: number
}

export const SegmentedRewardsSimulator = ({
  interestOnStakedBalance,
  stakedLiquidityDollarValue,
}: SegmentedRewardsSimulatorProps) => {
  const values = useRef([
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'day', label: 'Day' },
  ]).current

  const [activeValue, setActiveValue] =
    useState<typeof values[number]['value']>('year')

  const hasStakedLiquidity = stakedLiquidityDollarValue > 0

  const yearRewardOnStakedBalance =
    stakedLiquidityDollarValue * interestOnStakedBalance

  let divider = 1
  if (activeValue === 'month') {
    divider = 12
  } else if (activeValue === 'day') {
    divider = 365
  }

  const rewardsAmountInDollarValue = dollarValueFormatterWithDecimals(
    protectAgainstNaN(yearRewardOnStakedBalance / divider),
    { includeCommaSeparation: true }
  )

  return (
    <>
      <SegmentedControl
        activeValue={activeValue}
        values={values}
        onChange={({ value }, event) => {
          event.stopPropagation()
          setActiveValue(value)
        }}
      />

      <Text
        variant="header"
        color={hasStakedLiquidity ? 'brand' : 'disabled'}
        css={{ padding: '$16 0 $34' }}
      >
        {hasStakedLiquidity
          ? `+ $${rewardsAmountInDollarValue} /${activeValue}`
          : '-- /day'}
      </Text>
    </>
  )
}
