import { HTMLProps } from 'react'
import { useAmountChangeController } from '../hooks/useAmountChangeController'

type Props = Omit<
  HTMLProps<HTMLInputElement>,
  'min' | 'max' | 'value' | 'onChange'
> & {
  min?: number
  max?: number
  maximumFractionDigits?: number
  adjustedWidthToValue?: boolean
  value: number
  onChange: (value: number) => void
}

export const BasicNumberInput = ({
  min = -Infinity,
  max = Infinity,
  adjustedWidthToValue = true,
  maximumFractionDigits = 6,
  value: amount,
  onChange,
  style,
  ...props
}: Props) => {
  const { value, setValue } = useAmountChangeController({
    maximumFractionDigits,
    maximumValue: max,
    minimumValue: min,

    amount,
    onAmountChange: onChange,
  })

  return (
    <input
      placeholder="0.0"
      type="number"
      value={value}
      style={
        adjustedWidthToValue
          ? {
              ...(style ? style : {}),
              width: `${value.length}ch`,
            }
          : style
      }
      onChange={({ target: { value } }) => setValue(value)}
      {...props}
    />
  )
}
