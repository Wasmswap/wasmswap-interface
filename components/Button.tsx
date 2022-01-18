import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  cloneElement,
  Children,
  ReactElement,
} from 'react'
import type { VariantProps, CSS } from '@stitches/react'
import { styled } from './theme'
import { GetRenderAsProps, RenderAsType } from './types'

const StyledButton = styled('button', {
  $$textColor: '$textColors$primary',
  $$iconColor: '$iconColors$primary',

  $$backgroundColor: '$colors$dark10',
  $$backgroundColorOnHover: '$colors$dark20',
  $$backgroundColorOnActive: '$colors$dark5',

  $$borderColorOnFocus: '$borderColors$selected',

  fontFamily: '$primary',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'pre',

  color: '$$textColor',
  fontSize: '$6',
  lineHeight: '$3',
  fontWeight: '$normal',
  borderRadius: '$1',

  backgroundColor: '$$backgroundColor',

  transition: 'background 0.15s ease-out',

  '&:hover': {
    backgroundColor: '$$backgroundColorOnHover',
  },
  '&:active': {
    backgroundColor: '$$backgroundColorOnActive',
  },
  '&:focus.focus-visible': {
    boxShadow: '0 0 0 $space$1 $$borderColorOnFocus',
  },

  '& svg': {
    color: '$$iconColor',
  },

  variants: {
    variant: {
      primary: {
        $$textColor: '$colors$white',
        $$iconColor: '$colors$white',

        $$backgroundColor: '$colors$dark95',
        $$backgroundColorOnHover: '$colors$black',
        $$backgroundColorOnActive: '$colors$dark85',

        $$borderColorOnFocus: '$borderColors$selected',
      },
      secondary: {
        $$textColor: '$textColors$primary',
        $$iconColor: '$iconColors$primary',

        $$backgroundColor: '$colors$dark10',
        $$backgroundColorOnHover: '$colors$dark20',
        $$backgroundColorOnActive: '$colors$dark5',

        $$borderColorOnFocus: '$borderColors$selected',
      },
      ghost: {
        $$textColor: '$textColors$secondary',
        $$iconColor: '$iconColors$primary',

        $$backgroundColor: '$colors$dark0',
        $$backgroundColorOnHover: '$colors$dark10',
        $$backgroundColorOnActive: '$colors$dark5',

        $$borderColorOnFocus: '$borderColors$selected',
      },
      menu: {
        $$textColor: '$textColors$body',
        $$iconColor: '$iconColors$primary',

        $$backgroundColor: '$colors$brand0',
        $$backgroundColorOnHover: '$colors$brand10',
        $$backgroundColorOnActive: '$colors$brand15',

        $$borderColorOnFocus: '$borderColors$selected',
      },
    },

    icon: {
      left: {
        display: 'grid',
        gridTemplateAreas: '"a b"',
        columnGap: '$space$1',
        justifyContent: 'start',
      },
      right: {
        display: 'grid',
        columnGap: '$space$1',
        gridTemplateAreas: '"a b"',
        justifyContent: 'space-between',
      },
      both: {
        display: 'grid',
        columnGap: '$space$1',
        gridTemplateAreas: '"a b c"',
        justifyContent: 'space-between',
      },
      only: {},
    },
    size: {
      large: {
        padding: '$6 $8',
      },
      medium: {
        padding: '$2 $8 $3',
      },
      small: {
        padding: '$2 $4',
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
    selected: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      css: {
        $$backgroundColor: '$colors$dark30',
        $$textColor: '$colors$light95',
        $$iconColor: '$iconColors$disabled',
      },
    },
    {
      variant: 'secondary',
      disabled: true,
      css: {
        $$backgroundColor: '$colors$dark5',
        $$textColor: '$textColors$disabled',
        $$iconColor: '$iconColors$disabled',
      },
    },
    {
      variant: 'ghost',
      disabled: true,
      css: {
        $$textColor: '$textColors$disabled',
        $$iconColor: '$iconColors$disabled',
      },
    },
    {
      size: 'medium',
      icon: 'left',
      css: {
        paddingLeft: '$3',
        paddingTop: '$2',
        paddingBottom: '$2',
      },
    },
    {
      size: 'medium',
      icon: 'right',
      css: {
        paddingRight: '$3',
        paddingTop: '$2',
        paddingBottom: '$2',
      },
    },
    {
      size: 'medium',
      icon: 'both',
      css: {
        padding: '$2 $3',
      },
    },
    {
      size: 'large',
      icon: 'left',
      css: {
        paddingLeft: '$3',
        paddingTop: '$4',
        paddingBottom: '$4',
      },
    },
    {
      size: 'large',
      icon: 'right',
      css: {
        paddingRight: '$3',
        paddingTop: '$4',
        paddingBottom: '$4',
      },
    },
    {
      size: 'large',
      icon: 'both',
      css: {
        padding: '$4 $3',
      },
    },

    {
      size: 'medium',
      icon: 'only',
      css: {
        padding: '$2 $3',
      },
    },
    {
      size: 'small',
      icon: 'only',
      css: {
        padding: '0',
      },
    },

    {
      variant: 'ghost',
      selected: true,
      css: {
        $$backgroundColor: '$$backgroundColorOnHover',
      },
    },
    {
      variant: 'secondary',
      selected: true,
      css: {
        $$backgroundColor: '$$backgroundColorOnHover',
      },
    },
    {
      variant: 'menu',
      selected: true,
      css: {
        $$backgroundColor: '$$backgroundColorOnHover',
      },
    },
  ],

  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
})

export type ButtonProps<T extends RenderAsType = 'button'> = Omit<
  Omit<VariantProps<typeof StyledButton>, 'icon'> & GetRenderAsProps<T>,
  'iconLeft' | 'iconRight' | 'icon'
> & { as?: T; css?: CSS } & (
    | {
        children?: ReactNode
        iconLeft?: ReactElement
        iconRight?: ReactElement
        icon?: never
      }
    | {
        children?: never
        iconLeft?: never
        iconRight?: never
        icon?: ReactElement
      }
  )

function ButtonComponent<T extends RenderAsType = 'button'>(
  { children, as, icon, iconLeft, iconRight, ...props }: ButtonProps<T>,
  ref?: ForwardedRef<any>
) {
  return (
    <StyledButton
      icon={mapIconVariant({ iconLeft, icon, iconRight })}
      ref={ref}
      {...props}
      as={as as any}
    >
      {icon ? (
        cloneElement(Children.only(icon), {
          color: 'inherit',
          size: '24px',
        })
      ) : (
        <>
          {iconLeft &&
            cloneElement(Children.only(iconLeft), {
              color: 'inherit',
              size: '24px',
            })}
          {children}
          {iconRight &&
            cloneElement(Children.only(iconRight), {
              color: 'inherit',
              size: '24px',
            })}
        </>
      )}
    </StyledButton>
  )
}

const mapIconVariant = ({
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

export const ButtonForWrapper = styled(
  (props: any) => <Button as="div" {...props} />,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  }
) as typeof ButtonComponent
