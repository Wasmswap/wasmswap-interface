import styled from 'styled-components'
import { colorTokens } from '../util/constants'
import { ReactNode } from 'react'

type IconWrapperProps = {
  icon: ReactNode
  rounded?: boolean
  color?: keyof typeof colorTokens | string
  size?: string
}

export const IconWrapper = ({
  icon,
  rounded,
  color,
  size = '14px',
  ...props
}: IconWrapperProps) => (
  <StyledIcon {...props} $color={color} $rounded={rounded} $size={size}>
    {icon}
  </StyledIcon>
)

const StyledIcon = styled.div`
  color: ${(p) => colorTokens[p.$color] || p.$color};
  width: ${(p) => p.$size};
  height: ${(p) => p.$size};
  min-width: ${(p) => p.$size};
  min-height: ${(p) => p.$size};
  border-radius: ${(p) => (p.$rounded ? '50%' : 'unset')};
  fill: currentColor;
`
