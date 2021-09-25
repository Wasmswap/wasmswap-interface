import React, { HTMLProps, FC } from 'react'
import styled, { css } from 'styled-components'
import { Text } from './Text'
import { colorTokens } from '../util/constants'

export const resetStylesForButton = css`
  text-transform: none;
  -webkit-appearance: button;
  padding: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  background: none;
  cursor: pointer;
  user-select: none;
`

type ButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'size'> & {
  variant?: 'primary'
  size?: 'humongous' | 'medium'
}

export const StyledButton = styled.button<ButtonProps>`
  ${resetStylesForButton};
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  padding: ${(props: ButtonProps) =>
    props.size === 'humongous' ? '24px' : '12px 14px'};
  width: ${(props: ButtonProps) =>
    props.size === 'humongous' ? '100%' : 'auto'};
  background-color: ${({ disabled }) => {
    return disabled ? colorTokens.gray : colorTokens.primary
  }};
  cursor: ${({ disabled }) => {
    return disabled ? 'auto' : 'pointer'
  }};

  transition: opacity 0.1s ease-out;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`

export const Button: FC<ButtonProps> = ({
  variant: __variant,
  children,
  ...props
}) => (
  <StyledButton {...props}>
    {typeof children === 'string' ? (
      <Text
        type={props.size === 'humongous' ? 'heading' : 'body'}
        variant={props.size === 'humongous' ? 'normal' : 'light'}
        color="white"
      >
        {children}
      </Text>
    ) : (
      children
    )}
  </StyledButton>
)
