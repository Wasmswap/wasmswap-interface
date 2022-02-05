import { styled } from '../theme'
import { ReactNode } from 'react'
import { DialogContent } from './DialogContent'

type DialogButtonsProps = {
  alignment?: 'flex-end' | 'center' | 'flex-start'
  children: ReactNode
}

export const DialogButtons = ({ alignment, children }: DialogButtonsProps) => (
  <DialogContent>
    <StyledDivForFooter
      css={alignment ? { justifyContent: alignment } : undefined}
    >
      {children}
    </StyledDivForFooter>
  </DialogContent>
)

const StyledDivForFooter = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  columnGap: '$space$6',
  padding: '$8 0',
})
