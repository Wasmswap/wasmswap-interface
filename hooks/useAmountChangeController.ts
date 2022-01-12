import { useEffect, useRef, useState } from 'react'
import { createBalanceFormatter, formatTokenBalance } from '../util/conversion'

type UseAmountChangeControllerArgs = {
  amount: number
  onAmountChange: (amount: number) => void
  maximumFractionDigits?: number
  maximumValue?: number
  minimumValue?: number
}

export const useAmountChangeController = ({
  amount,
  onAmountChange,
  maximumFractionDigits = 6,
  maximumValue = Infinity,
  minimumValue = -Infinity,
}: UseAmountChangeControllerArgs) => {
  const formatterRef = useRef<typeof formatTokenBalance>()

  if (!formatterRef.current) {
    formatterRef.current = createBalanceFormatter({ maximumFractionDigits })
  }

  const minimumFractionDigitsRef = useRef(0)
  const formatter = formatterRef.current

  const [localValue, setLocalValue] = useState(
    () =>
      formatter(amount, {
        includeCommaSeparation: false,
        applyNumberConversion: false,
      }) as string
  )

  /* sync external state (number) with the local value (string) */
  useEffect(() => {
    setLocalValue((localValueAmount) => {
      const shouldUpdateLocalValue =
        formatter(amount) !== formatter(localValueAmount)

      if (shouldUpdateLocalValue) {
        return formatter(amount, {
          applyNumberConversion: false,
        }) as string
      }

      return localValueAmount
    })
  }, [amount]) // eslint-disable-line

  /* convert raw string input value into a formatter string value */
  const handleAmountChange = (value: string) => {
    /* get the decimals */
    const [, decimals = ''] = value.split('.')
    const decimalsCount = Math.min(decimals.length, maximumFractionDigits)

    /* update the balance formatter to include all the digits after the dot */
    if (minimumFractionDigitsRef.current !== decimalsCount) {
      minimumFractionDigitsRef.current = decimalsCount
      formatterRef.current = createBalanceFormatter({
        minimumFractionDigits: decimalsCount,
        maximumFractionDigits,
      })
    }

    let rawValue: string | number = value

    if (Number(rawValue) > maximumValue) {
      rawValue = maximumValue
    } else if (Number(rawValue) < minimumValue) {
      rawValue = minimumValue
    }

    const formattedValue = formatterRef.current(rawValue, {
      includeCommaSeparation: false,
      applyNumberConversion: false,
    }) as string

    /* set the displayed value */
    setLocalValue(formattedValue)

    /* update the external value */
    onAmountChange(
      formatter(formattedValue, {
        applyNumberConversion: true,
      }) as number
    )
  }

  return {
    formatter,
    value: localValue,
    setValue: handleAmountChange,
  }
}
