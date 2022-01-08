import { styled } from 'components/theme'
import { Button } from '../../../components/Button'
import { Text } from '../../../components/Text'
import type { ButtonProps } from './PrimaryButton'
import { ButtonSize } from './PrimaryButton'
import { ReactNode } from 'react'
import { IconWrapper } from '../../../components/IconWrapper'

export const SecondaryButton = ({
  children,
  size = ButtonSize.medium,
  iconBefore,
  iconAfter,
  ...props
}: ButtonProps & {
  active?: boolean
  iconBefore?: ReactNode
  iconAfter?: ReactNode
}) => {
  return (
    <StyledButton variant="secondary" size={size} {...(props as any)}>
      {iconBefore && (
        <IconWrapper size="16px" icon={iconBefore} color="secondaryText" />
      )}
      <Text
        type={size === ButtonSize.medium ? 'caption' : 'microscopic'}
        color="secondaryText"
      >
        {children}
      </Text>
      {iconAfter && (
        <IconWrapper size="16px" icon={iconAfter} color="secondaryText" />
      )}
    </StyledButton>
  )
}

const StyledButton = styled(Button, {
  padding: '8px 16px',
  columnGap: 8,
  display: 'flex',
  alignItems: 'center',
  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(25, 29, 32, 0.15)',
      },
      false: {
        backgroundColor: 'rgba(25, 29, 32, 0)',
      },
    },
    size: {
      [ButtonSize.medium]: {
        padding: '11px 24px',
        borderRadius: '8px',
      },
    },
  },
})
