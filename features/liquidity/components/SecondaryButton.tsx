import { styled } from '@stitches/react'
import { StyledSecondaryButton } from '../../../components/Button'
import { Text } from '../../../components/Text'
import type { ButtonProps } from './PrimaryButton'
import { ButtonSize } from './PrimaryButton'

export const SecondaryButton = ({
  children,
  size = ButtonSize.medium,
  ...props
}: ButtonProps & { active?: boolean }) => {
  return (
    <StyledButton size={size} {...(props as any)}>
      <Text
        type={size === ButtonSize.medium ? 'caption' : 'microscopic'}
        color="secondaryText"
      >
        {children}
      </Text>
    </StyledButton>
  )
}

const StyledButton = styled(StyledSecondaryButton, {
  padding: '8px 16px',
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
