import styled from 'styled-components'
import { colorTokens } from '../util/constants'
import { HTMLProps, ReactNode } from 'react'

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

export const IconWrapper = ({
  icon,
  rounded,
  color,
  size = '16px',
  rotation,
  type,
  ...props
}: IconWrapperProps) => (
  <StyledIcon
    {...props}
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
  cursor: ${(p) => (p.$isButton ? 'pointer' : 'auto')};
`
