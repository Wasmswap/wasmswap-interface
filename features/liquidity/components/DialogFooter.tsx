import { styled } from 'components/theme'
import { Text } from '../../../components/Text'
import { ReactNode } from 'react'

type DialogFooterProps = {
  title?: ReactNode | string
  text?: ReactNode | string
  buttons: ReactNode | string
}

export const DialogFooter = ({ title, text, buttons }: DialogFooterProps) => {
  return (
    <StyledDivForFooter>
      {title && (
        <Text type="caption" paddingBottom="8px">
          {title}
        </Text>
      )}

      {text && (
        <Text type="caption" variant="light" paddingBottom="24px">
          {text}
        </Text>
      )}
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
