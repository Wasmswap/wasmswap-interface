import { Children, cloneElement, ReactElement, ReactNode } from 'react'
import { darkTheme, lightTheme, styled, useTheme } from '../theme'
import { Text } from '../Text'
import { Button } from '../Button'
import { IconWrapper } from '../IconWrapper'
import { Union } from '../../icons/Union'
import { animated, useSpring } from '@react-spring/web'

type ToastProps = {
  icon: ReactElement
  title: ReactNode
  body?: ReactNode
  buttons?: ReactNode
  onClose: () => void
}

export const Toast = ({ title, body, buttons, onClose, icon }: ToastProps) => {
  const styles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  })

  const theme = useTheme()
  const themeClassName =
    theme === lightTheme ? darkTheme.className : lightTheme.className

  return (
    <StyledToast className={themeClassName} style={styles}>
      {icon &&
        cloneElement(Children.only(icon), {
          size: '24px',
        })}
      <StyledBodyContent>
        <Text variant="primary">{title}</Text>
        {body && (
          <Text
            variant="secondary"
            css={{ paddingTop: '$2', overflowWrap: 'break-word' }}
          >
            {body}
          </Text>
        )}
        {buttons && <StyledDivForButtons>{buttons}</StyledDivForButtons>}
      </StyledBodyContent>
      <StyledButtonForCloseButton
        variant="ghost"
        icon={<IconWrapper icon={<Union />} />}
        onClick={onClose}
      />
    </StyledToast>
  )
}

const StyledToast = styled(animated.div, {
  display: 'flex',
  position: 'relative',
  backgroundColor: '$colors$white',
  boxShadow: '0px 4px 10px 0px $colors$dark15, 0 0 0 1px $colors$dark20',
  padding: '$8 $7',
  columnGap: '$space$2',
  borderRadius: '$1',
  width: '90%',
  maxWidth: '22rem',
})

const StyledBodyContent = styled('div', {
  paddingRight: 'calc(24px + $space$4)',
  width: '100%',
})

const StyledButtonForCloseButton = styled(Button, {
  position: 'absolute',
  right: '$space$4',
  top: '$space$4',
  '& svg': { color: '$iconColors$default' },
})

const StyledDivForButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  columnGap: '$space$2',
  paddingTop: '$5',
})
