import { Union } from 'icons'
import { ReactNode } from 'react'

import { styled } from '../../theme'
import { Button } from '../Button'
import { IconWrapper } from '../IconWrapper'
import { useDialogContext } from './DialogContext'

type DialogHeaderProps = {
  children: ReactNode
  paddingBottom?: string
}

export const DialogHeader = ({
  children,
  paddingBottom,
}: DialogHeaderProps) => {
  const { onRequestClose } = useDialogContext()

  return (
    <StyledDivForHeader css={paddingBottom ? { paddingBottom } : undefined}>
      {children}
      <StyledButtonForCloseButton
        variant="ghost"
        icon={<IconWrapper icon={<Union />} size="16px" />}
        onClick={onRequestClose}
      />
    </StyledDivForHeader>
  )
}

const StyledDivForHeader = styled('div', {
  padding: '$12 $14 0 $14',
  marginRight: 'auto',
  position: 'relative',
})

const StyledButtonForCloseButton = styled(Button, {
  position: 'absolute',
  top: '$space$8',
  right: '$space$8',
})
