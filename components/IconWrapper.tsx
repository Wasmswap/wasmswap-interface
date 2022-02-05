import styled, { css } from 'styled-components'
import { ForwardedRef, forwardRef, HTMLProps, ReactNode } from 'react'
import { useTheme } from './theme'
import { lightThemeColorTokens } from './theme/colors'

export type IconWrapperProps = Omit<
  HTMLProps<HTMLDivElement>,
  'children' | 'ref' | 'color' | 'size' | 'type'
> & {
  type?: 'button'
  icon: ReactNode
  rounded?: boolean
  color?: keyof typeof lightThemeColorTokens.iconColors | string
  size?: string
  rotation?: string
}

const IconWrapperComponent = (
  {
    icon,
    rounded,
    color = 'primary',
    size = '24px',
    width,
    height,
    rotation,
    type,
    ...props
  }: IconWrapperProps,
  ref: ForwardedRef<any>
) => {
  const theme = useTheme()
  return (
    <StyledIcon
      {...props}
      ref={ref}
      role={type === 'button' ? 'button' : undefined}
      $isButton={type === 'button'}
      $theme={theme}
      $color={color}
      $rounded={rounded}
      $rotation={rotation}
      $size={size}
      $width={width}
      $height={height}
    >
      {icon}
    </StyledIcon>
  )
}

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

const StyledIcon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(p) => p.$theme.iconColors[p.$color]?.value || p.$color};
  width: ${(p) => p.$width || p.$size};
  height: ${(p) => p.$height || p.$size};
  min-width: ${(p) => p.$width || p.$size};
  min-height: ${(p) => p.$height || p.$size};
  border-radius: ${(p) => (p.$rounded ? '50%' : 'unset')};
  ${(p) => (p.$rotation ? `transform: rotateZ(${p.$rotation})` : '')};
  fill: currentColor;
  ${(p) => (p.$isButton ? buttonStyles : undefined)}
`

export const IconWrapper = forwardRef(IconWrapperComponent)
