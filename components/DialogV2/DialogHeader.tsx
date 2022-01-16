import { styled } from '../theme'
import { IconWrapper } from '../IconWrapper'
import { Union } from '../../icons/Union'
import { Button } from '../Button'
import { useDialogContext } from './DialogContext'
import { ReactNode } from 'react'

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
