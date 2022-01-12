import { Text } from '../../../components/Text'
import React from 'react'
import { styled } from '@stitches/react'
import { StyledSecondaryButton } from '../../../components/Button'
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
          onClick={() => {
            let amount =
              tokenSymbol === getBaseToken().symbol
                ? availableAmount - 0.025
                : availableAmount
            onChange(amount)
          }}
        >
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

const StyledButton = styled(StyledSecondaryButton, {
  borderRadius: '38px',
  marginRight: 6,
  '&:first-of-type': {
    marginLeft: 8,
  },
})
