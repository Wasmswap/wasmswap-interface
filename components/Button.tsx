import { ForwardedRef, ReactNode, forwardRef } from 'react'
import Color from 'color'
import type { VariantProps } from '@stitches/react'
import { styled, theme, colors } from './theme'
import { GetRenderAsProps, RenderAsType } from './types'

console.log({ theme })

const StyledButton = styled('button', {
  fontFamily: '$primary',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'pre',

  fontSize: '$6',
  lineHeight: '$3',
  fontWeight: '$medium',
  color: '$textColors$body',
  borderRadius: '$1',

  transition: 'background 0.15s ease-out',

  variants: {
    icon: {
      left: {
        display: 'grid',
        gridTemplateAreas: '"a b"',
        columnGap: '2px',
      },
      right: {
        display: 'grid',
        columnGap: '2px',
        gridTemplateAreas: '"a b"',
      },
      both: {
        display: 'grid',
        columnGap: '2px',
        gridTemplateAreas: '"a b c"',
      },
      only: {},
    },
    size: {
      large: {
        padding: '11px 16px',
      },
      medium: {
        padding: '7px 16px',
      },
    },
    variant: {
      primary: {
        backgroundColor: Color(colors.dark).alpha(0.95).rgb().string(),
        color: '$white',
        '&:hover': {
          backgroundColor: '$colors$black',
        },
        '&:active': {
          backgroundColor: Color(colors.dark).alpha(0.85).rgb().string(),
        },
        '&:focus.focus-visible': {
          boxShadow: `0 0 0 2px ${Color(colors.dark)
            .alpha(0.3)
            .rgb()
            .string()}`,
        },
      },
      secondary: {
        backgroundColor: '#e8e9e9',
        color: '$textColors$primary',
        '&:hover': {
          backgroundColor: 'rgba(25, 29, 32, 0.2)',
        },
        '&:active': {
          backgroundColor: 'rgba(25, 29, 32, 0.05)',
        },
        '&:focus.focus-visible': {
          boxShadow: '0 0 0 2px rgba(25, 29, 32, 0.3)',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#535658',
        '&:hover': {
          backgroundColor: 'rgba(25, 29, 32, 0.1)',
        },
        '&:active': {
          backgroundColor: 'rgba(25, 29, 32, 0.05)',
        },
        '&:focus.focus-visible': {
          boxShadow: '0 0 0 2px rgba(25, 29, 32, 0.3)',
        },
      },
    },
    disabled: {
      true: {
        pointerEvents: 'none',
        cursor: 'not-allowed',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      css: {
        backgroundColor: Color(colors.dark),
        color: 'rgba(243, 246, 248, 0.7)',
      },
    },
    {
      variant: 'secondary',
      disabled: true,
      css: {
        backgroundColor: 'rgba(25, 29, 32, 0.05)',
        color: 'rgba(25, 29, 32, 0.3)',
      },
    },
    {
      variant: 'ghost',
      disabled: true,
      css: {
        color: 'rgba(25, 29, 32, 0.3)',
      },
    },
    {
      size: 'medium',
      icon: 'left',
      css: {
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4,
      },
    },
    {
      size: 'medium',
      icon: 'right',
      css: {
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
      },
    },
    {
      size: 'medium',
      icon: 'both',
      css: {
        padding: '4px 6px',
      },
    },
    {
      size: 'large',
      icon: 'left',
      css: {
        paddingLeft: 6,
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    {
      size: 'large',
      icon: 'right',
      css: {
        paddingRight: 6,
        paddingTop: 8,
        paddingBottom: 8,
      },
    },
    {
      size: 'large',
      icon: 'both',
      css: {
        padding: '8px 6px',
      },
    },
  ],

  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})

type ButtonProps<T extends RenderAsType = 'button'> = Omit<
  Omit<VariantProps<typeof StyledButton>, 'icon'> & GetRenderAsProps<T>,
  'iconLeft' | 'iconRight' | 'icon'
> &
  (
    | {
        children?: ReactNode
        iconLeft?: ReactNode
        iconRight?: ReactNode
        icon?: never
      }
    | {
        children?: never
        iconLeft?: never
        iconRight?: never
        icon?: ReactNode
      }
  )

function ButtonComponent<T extends RenderAsType = 'button'>(
  { children, as, icon, iconLeft, iconRight, ...props }: ButtonProps<T>,
  ref?: ForwardedRef<any>
) {
  return (
    <StyledButton
      icon={getIconVariant({ iconLeft, icon, iconRight })}
      ref={ref}
      {...props}
      as={as as any}
    >
      {icon ? (
        icon
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </StyledButton>
  )
}

const getIconVariant = ({
  iconRight,
  iconLeft,
  icon,
}): VariantProps<typeof StyledButton>['icon'] => {
  if (iconLeft && iconRight) return 'both'
  if (iconLeft) return 'left'
  if (iconRight) return 'right'
  if (icon) return 'only'
  return undefined
}

export const Button = forwardRef(ButtonComponent) as typeof ButtonComponent
