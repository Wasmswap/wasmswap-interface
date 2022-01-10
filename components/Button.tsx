import { ForwardedRef, ReactNode, forwardRef } from 'react'
import type { VariantProps, CSS } from '@stitches/react'
import { styled } from './theme'
import { GetRenderAsProps, RenderAsType } from './types'

const StyledButton = styled('button', {
  fontFamily: '$primary',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'pre',

  color: '$textColors$body',
  fontSize: '$6',
  lineHeight: '$3',
  fontWeight: '$normal',
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
        padding: '$6 $8',
      },
      medium: {
        padding: '$4 $8',
      },
      small: {
        padding: '$2 $4',
      },
    },
    variant: {
      primary: {
        backgroundColor: '$colors$dark95',
        color: '$white',
        '&:hover': {
          backgroundColor: '$colors$black',
        },
        '&:active': {
          backgroundColor: '$colors$dark85',
        },
        '&:focus.focus-visible': {
          boxShadow: '0 0 0 2px $borderColors$selected',
        },
      },
      secondary: {
        backgroundColor: '$colors$dark10',
        color: '$textColors$primary',
        '&:hover': {
          backgroundColor: '$colors$dark20',
        },
        '&:active': {
          backgroundColor: '$colors$dark5',
        },
        '&:focus.focus-visible': {
          boxShadow: '0 0 0 2px $borderColors$selected',
        },
      },
      ghost: {
        backgroundColor: '$colors$dark0',
        color: '$textColors$secondary',
        '&:hover': {
          backgroundColor: '$colors$dark10',
        },
        '&:active': {
          backgroundColor: '$colors$dark5',
        },
        '&:focus.focus-visible': {
          boxShadow: '0 0 0 2px $borderColors$selected',
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
    allowInteractivity: {
      true: {
        pointerEvents: 'unset',
        cursor: 'pointer',
      },
    },
  },

  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      css: {
        backgroundColor: '$colors$dark30',
        color: '$colors$light95',
      },
    },
    {
      variant: 'secondary',
      disabled: true,
      css: {
        backgroundColor: '$colors$dark5',
        color: '$textColors$disabled',
      },
    },
    {
      variant: 'ghost',
      disabled: true,
      css: {
        color: '$textColors$disabled',
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
> & { css?: CSS } & (
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
