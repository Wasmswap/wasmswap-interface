import React from 'react'
import { styled } from 'components/theme'
import { Button } from '../../../components/Button'
import { getBaseToken } from 'hooks/useTokenInfo'

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
  return (
    !disabled && (
      <>
        <StyledButton
          variant="secondary"
          onClick={() => {
            let amount =
              tokenSymbol === getBaseToken().symbol
                ? availableAmount - 0.025
                : availableAmount
            onChange(amount)
          }}
        >
          Max
        </StyledButton>
        <StyledButton
          variant="secondary"
          onClick={() => onChange(availableAmount / 2)}
        >
          1/2
        </StyledButton>
      </>
    )
  )
}

const StyledButton = styled(Button, {
  marginRight: 6,
  '&:first-of-type': {
    marginLeft: 8,
  },
})
