import React, { HTMLProps, FC, ReactNode } from 'react'
import styled from 'styled-components'
import { styled as stitchesStyled } from '@stitches/react'
import { Text } from './Text'
import { colorTokens } from '../util/constants'

type ButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'size'> & {
  iconBefore?: ReactNode
  variant?: 'primary' | 'rounded'
  size?: 'humongous' | 'medium' | 'small'
}

export const StyledButton = styled.button<ButtonProps>`
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border-radius: ${(p) => (p.variant === 'rounded' ? '18px' : '6px')};
  padding: ${(props: ButtonProps) => {
    switch (props.size) {
      case 'humongous':
        return '24px'
      case 'medium':
        return props.variant === 'rounded' ? '9px 14px' : '12px 14px'
      case 'small':
        return '8px 12px'
      default:
        return '5px 12px'
    }
  }};
  width: ${(props: ButtonProps) =>
    props.size === 'humongous' ? '100%' : 'auto'};
  background-color: ${({ disabled, type, color }) => {
    return disabled || type === 'disabled'
      ? colorTokens.gray
      : colorTokens[color] || color || colorTokens.black
  }};
  cursor: ${({ disabled }) => {
    return disabled ? 'auto' : 'pointer'
  }};

  transition: opacity 0.1s ease-out, background-color 0.15s ease-out;

  &:hover {
    opacity: ${(p) => (p.disabled || p.type === 'disabled' ? 1 : 0.9)};
  }

  &:active {
    opacity: 0.85;
  }
`

const mapTextSize = (size: ButtonProps['size']) => {
  switch (size) {
    case 'humongous':
      return 'heading'
    case 'small':
      return 'subtitle'
    default:
      return 'body'
  }
}

export const Button: FC<ButtonProps> = ({
  variant,
  size = 'medium',
  children,
  iconBefore,
  ...props
}) => (
  <StyledButton variant={variant} size={size} {...props}>
    {iconBefore && (
      <StyledIconWrapper $position="left">{iconBefore}</StyledIconWrapper>
    )}
    {typeof children === 'string' ? (
      <Text type={mapTextSize(size)} variant="light" color="white">
        {children}
      </Text>
    ) : (
      children
    )}
  </StyledButton>
)

const StyledIconWrapper = styled.span`
  display: inline-block;
  padding: ${(p) => (p.$position === 'left' ? '0 6px 0 0' : '0 0 0 6px')};
`

export const StyledSecondaryButton = stitchesStyled('button', {
  padding: '8px 12px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  borderRadius: '6px',
  transition: 'background-color .1s ease-out',
  '&:hover': {
    backgroundColor: 'rgba(25, 29, 32, 0.15)',
  },
  '&:active': {
    backgroundColor: 'rgba(25, 29, 32, 0.05)',
  },
})
