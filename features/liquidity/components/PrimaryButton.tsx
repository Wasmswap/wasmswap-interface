import { styled } from '@stitches/react'
import { Text } from '../../../components/Text'
import { HTMLProps } from 'react'
import { Spinner } from '../../../components/Spinner'

export enum ButtonSize {
  medium = 'medium',
  small = 'small',
}

export type ButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'size'> & {
  size?: keyof typeof ButtonSize
  loading?: boolean
}

export const PrimaryButton = ({
  children,
  size = ButtonSize.medium,
  loading,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton loading={loading} size={size} {...(props as any)}>
      <Text
        type={size === ButtonSize.medium ? 'caption' : 'microscopic'}
        color="white"
      >
        {loading ? <Spinner instant /> : children}
      </Text>
    </StyledButton>
  )
}

const StyledButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(22, 22, 22, 1)',
  borderRadius: '6px',
  transition: 'background-color .1s ease-out',
  '&:hover': {
    backgroundColor: 'rgba(22, 22, 22, 0.95)',
  },
  '&:active': {
    backgroundColor: 'rgba(22, 22, 22, 0.9)',
  },
  variants: {
    loading: {
      true: {
        backgroundColor: 'rgba(22, 22, 22, 0.75) !important',
      },
    },
    size: {
      [ButtonSize.small]: {
        padding: '8px 12px',
      },
      [ButtonSize.medium]: {
        padding: '11px 24px',
        borderRadius: '8px',
      },
    },
  },
  compoundVariants: [
    {
      size: ButtonSize.medium,
      loading: true,
      css: {
        padding: '6px 24px',
      },
    },
  ],
})
