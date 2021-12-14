import { Text } from '../../Text'
import React from 'react'
import { styled } from '@stitches/react'

type ConvenienceBalanceButtonsProps = {
  disabled?: boolean
  availableAmount: number
  onChange: (amount: number) => void
}

export const ConvenienceBalanceButtons = ({
  availableAmount,
  disabled,
  onChange,
}: ConvenienceBalanceButtonsProps) => {
  return (
    !disabled && (
      <>
        <StyledButton onClick={() => onChange(availableAmount)}>
          <Text type="subtitle" variant="light">
            Max
          </Text>
        </StyledButton>
        <StyledButton onClick={() => onChange(availableAmount / 2)}>
          <Text type="subtitle" variant="light">
            1/2
          </Text>
        </StyledButton>
      </>
    )
  )
}

const StyledButton = styled('button', {
  padding: '8px 12px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  borderRadius: '38px',
  marginRight: 6,
  '&:hover': {
    backgroundColor: 'rgba(25, 29, 32, 0.05)',
  },
  '&:active': {
    backgroundColor: 'rgba(25, 29, 32, 0.1)',
  },
  '&:first-of-type': {
    marginLeft: 8,
  },
})
