import { styled } from '@stitches/react'
import { Text } from '../Text'
import { ReactNode } from 'react'

type DialogFooterProps = {
  title: ReactNode | string
  text: ReactNode | string
  buttons: ReactNode | string
}

export const DialogFooter = ({ title, text, buttons }: DialogFooterProps) => {
  return (
    <StyledDivForFooter>
      <Text type="caption" paddingBottom="8px">
        {title}
      </Text>
      <Text type="caption" variant="light" paddingBottom="24px">
        {text}
      </Text>
      <StyledGridForButtons>{buttons}</StyledGridForButtons>
    </StyledDivForFooter>
  )
}

const StyledDivForFooter = styled('div', {
  padding: '16px 0 24px',
})

const StyledGridForButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  columnGap: 8,
})