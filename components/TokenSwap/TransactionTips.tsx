import { IconWrapper } from '../IconWrapper'
import { Exchange } from '../../icons/Exchange'
import { Text } from '../Text'
import React from 'react'
import { styled } from '@stitches/react'

type TransactionTipsProps = {
  dollarValue: number
}

export const TransactionTips = ({ dollarValue }: TransactionTipsProps) => {
  return (
    <StyledDivForWrapper>
      <IconWrapper width="24px" height="20px" icon={<Exchange />} />
      <Text type="microscopic" variant="bold" color="disabled">
        ≈ $ {dollarValue}
      </Text>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '15px 31px 15px 29px',
  display: 'grid',
  gridTemplateColumns: '24px 1fr',
  justifyContent: 'space-between',
  textAlign: 'right',
  borderTop: '1px solid rgba(25, 29, 32, 0.1)',
  borderBottom: '1px solid rgba(25, 29, 32, 0.1)',
})
