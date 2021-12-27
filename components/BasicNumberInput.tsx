import { HTMLProps } from 'react'

type Props = Omit<
  HTMLProps<HTMLInputElement>,
  'min' | 'max' | 'value' | 'onChange'
> & {
  min?: number
  max?: number
  adjustedWidthToValue?: boolean
  value: number
  onChange: (value: number) => void
}

export const BasicNumberInput = ({
  min = -Infinity,
  max = Infinity,
  adjustedWidthToValue = true,
  value,
  onChange,
  style,
  ...props
}: Props) => {
  const stringifiedValue = String(value)

  function handleChange({ target }) {
    const parsedValue = Math.min(Math.max(Number(target.value), min), max)
    onChange(parsedValue)
  }

  return (
    <input
      placeholder="0.0"
      max="100"
      type="number"
      value={stringifiedValue}
      style={
        adjustedWidthToValue
          ? {
              ...(style ? style : {}),
              width: `${stringifiedValue.length}ch`,
            }
          : style
      }
      onChange={handleChange}
      {...props}
    />
  )
}
