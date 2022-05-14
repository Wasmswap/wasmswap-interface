import { useBaseTokenInfo } from 'hooks/useTokenInfo'
import { Button } from 'junoblocks'
import React from 'react'

type ConvenienceBalanceButtonsProps = {
  disabled?: boolean
  tokenSymbol: string
  availableAmount: number
  onChange: (amount: number) => void
}

export const ConvenienceBalanceButtons = ({
  tokenSymbol,
  availableAmount,
  disabled,
  onChange,
}: ConvenienceBalanceButtonsProps) => {
  const baseToken = useBaseTokenInfo()
  return (
    !disabled && (
      <>
        <Button
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation()

            const amount =
              tokenSymbol === baseToken?.symbol
                ? availableAmount - 0.025
                : availableAmount

            onChange(amount)
          }}
        >
          Max
        </Button>
        <Button
          variant="secondary"
          onClick={() => onChange(availableAmount / 2)}
        >
          1/2
        </Button>
      </>
    )
  )
}
