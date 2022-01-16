import { ForwardedRef, forwardRef, HTMLProps, useRef, useState } from 'react'
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

const BasicNumberInputComponent = (
  {
    min = -Infinity,
    max = Infinity,
    adjustedWidthToValue = true,
    maximumFractionDigits = 6,
    value: amount,
    onChange,
    style,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { value, setValue } = useAmountChangeController({
    maximumFractionDigits,
    maximumValue: max,
    minimumValue: min,

    amount,
    onAmountChange: onChange,
  })

  return (
    <input
      ref={ref}
      placeholder="0.0"
      type="number"
      lang="en-US"
      value={value}
      style={
        adjustedWidthToValue
          ? {
              ...(style ? style : {}),
              width: `${calculateCharactersLength(value)}ch`,
            }
          : style
      }
      onChange={({ target: { value } }) => setValue(value)}
      {...props}
    />
  )
}

export const BasicNumberInput = forwardRef(
  BasicNumberInputComponent
) as typeof BasicNumberInputComponent

export function calculateCharactersLength(value: string) {
  const count = { symbols: 0, dotLikeSymbols: 0 }

  value.split('').forEach((symbol) => {
    if (symbol.match(/\.|\,/)) {
      count.dotLikeSymbols += 1
    } else {
      count.symbols += 1
    }
  })

  return count.symbols + count.dotLikeSymbols * 0.3
}

export const useTriggerInputFocus = () => {
  const ref = useRef<HTMLInputElement>()
  const [isFocused, setIsFocused] = useState(false)

  return {
    isFocused,
    bind: {
      button: {
        onClick() {
          ref.current.focus()
        },
      },
      input: {
        ref,
        onBlur() {
          setIsFocused(false)
        },
        onFocus() {
          setIsFocused(false)
        },
      },
    },
  }
}
