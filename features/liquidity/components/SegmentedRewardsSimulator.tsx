import {
  dollarValueFormatterWithDecimals,
  protectAgainstNaN,
  SegmentedControl,
  Text,
} from 'junoblocks'
import { useRef, useState } from 'react'

export const SegmentedRewardsSimulator = ({
  interestOnStakedBalance,
  stakedBalanceDollarValue,
}) => {
  const values = useRef([
    { value: 'year', label: 'Year' },
    { value: 'month', label: 'Month' },
    { value: 'day', label: 'Day' },
  ]).current

  const [activeValue, setActiveValue] =
    useState<typeof values[number]['value']>('year')

  const hasStakedLiquidity = stakedBalanceDollarValue > 0

  const yearRewardOnStakedBalance =
    stakedBalanceDollarValue * interestOnStakedBalance

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
