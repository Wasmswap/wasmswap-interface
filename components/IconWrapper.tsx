import styled, { css } from 'styled-components'
import { colorTokens } from '../util/constants'
import { ForwardedRef, forwardRef, HTMLProps, ReactNode } from 'react'

type IconWrapperProps = Omit<
  HTMLProps<HTMLDivElement>,
  'children' | 'ref' | 'color' | 'size' | 'type'
> & {
  type?: 'button'
  icon: ReactNode
  rounded?: boolean
  color?: keyof typeof colorTokens | string
  size?: string
  rotation?: string
}

const IconWrapperComponent = (
  {
    icon,
    rounded,
    color,
    size = '16px',
    rotation,
    type,
    ...props
  }: IconWrapperProps,
  ref: ForwardedRef<any>
) => (
  <StyledIcon
    {...props}
    ref={ref}
    role={type === 'button' ? 'button' : undefined}
    $color={color}
    $rounded={rounded}
    $rotation={rotation}
    $size={size}
    $isButton={type === 'button'}
  >
    {icon}
  </StyledIcon>
)

const buttonStyles = css`
  user-select: none;
  cursor: pointer;
  transition: box-shadow 0.1s ease-out, background-color 0.1s ease-out;
  background-color: rgba(25, 29, 32, 0);
  box-shadow: 0 0 0 0px rgba(25, 29, 32, 0);
  border-radius: 50%;
  &:hover {
    background-color: rgba(25, 29, 32, 0.1);
    box-shadow: 0 0 0 8px rgba(25, 29, 32, 0.1);
  }
  &:active {
    background-color: rgba(25, 29, 32, 0.05);
    box-shadow: 0 0 0 8px rgba(25, 29, 32, 0.05);
  }
`

const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) => colorTokens[p.$color] || p.$color};
  width: ${(p) => p.$size};
  height: ${(p) => p.$size};
  min-width: ${(p) => p.$size};
  min-height: ${(p) => p.$size};
  border-radius: ${(p) => (p.$rounded ? '50%' : 'unset')};
  transform: ${(p) => (p.$rotation ? `rotateZ(${p.$rotation})` : 'unset')};
  fill: currentColor;
  ${(p) => (p.$isButton ? buttonStyles : undefined)}
`

export const IconWrapper = forwardRef(IconWrapperComponent)
