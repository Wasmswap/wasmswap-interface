import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react'

import { media, styled } from '../theme'

const StyledDivForCardWrapper = styled('div', {
  $$backgroundColor: '$colors$white',
  $$backgroundColorOnHover: '$colors$white',
  $$backgroundColorOnActive: '$colors$white',

  position: 'relative',
  zIndex: '$1',
  borderRadius: '$2',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease-out, box-shadow 0.1s ease-out',
  backgroundColor: '$$backgroundColor',

  '&:hover': {
    $$backgroundColor: '$$backgroundColorOnHover',
  },

  '&:active': {
    $$backgroundColor: '$$backgroundColorOnActive',
  },

  boxShadow: '0 0 0 0 $$boxShadowColor',
  '&:focus': {
    boxShadow: '0 0 0 2px $borderColors$default',
  },

  variants: {
    variant: {
      primary: {
        $$borderSize: '1px',
        $$borderColor: '$borderColors$default',
        $$boxShadowColor: '$colors$black10',

        boxShadow:
          '0px 2px 6px $$boxShadowColor, 0 0 0 $$borderSize $$borderColor',

        '&:hover': {
          $$borderColor: '$borderColors$hover',
        },

        '&:active': {
          $$borderSize: '2px',
          $$borderColor: '$borderColors$default',
          $$boxShadowColor: '$colors$black0',
        },

        '&:focus': {
          $$borderSize: '1px',
          $$borderColor: '$borderColors$default',
          $$boxShadowColor: '$colors$black10',
        },
      },
      secondary: {
        $$backgroundColor: '$colors$dark10',
        $$backgroundColorOnHover: '$colors$dark15',
        $$backgroundColorOnActive: '$colors$dark5',
      },
      ghost: {
        cursor: 'auto',
        border: '1px dashed $borderColors$default',
        $$backgroundColor: '$colors$white',
        $$backgroundColorOnHover: '$$backgroundColor',
        $$backgroundColorOnActive: '$$backgroundColor',
        '&:focus': {
          boxShadow: '0 0 0 0 $colors$dark0',
        },
      },
    },

    active: {
      true: {},
    },

    disabled: {
      true: {},
    },
  },

  compoundVariants: [
    {
      disabled: true,
      variant: 'secondary',
      css: {
        $$backgroundColor: '$colors$dark5',
        $$backgroundColorOnHover: '$colors$dark5',
        $$backgroundColorOnActive: '$colors$dark5',
      },
    },
    {
      active: true,
      variant: 'secondary',
      css: {
        $$backgroundColor: '$colors$brand20',
        $$backgroundColorOnHover: '$colors$brand30',
        $$backgroundColorOnActive: '$colors$brand10',
      },
    },
    {
      active: true,
      variant: 'secondary',
      disabled: true,
      css: {
        $$backgroundColor: '$colors$brand10',
        $$backgroundColorOnHover: '$colors$brand10',
        $$backgroundColorOnActive: '$colors$brand10',
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
  },
})

const CardComponent = (
  {
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof StyledDivForCardWrapper>,
  ref: ForwardedRef<any>
) => {
  return (
    <StyledDivForCardWrapper {...props} ref={ref} role="button" tabIndex={-1}>
      {children}
    </StyledDivForCardWrapper>
  )
}

export const Card = forwardRef(CardComponent)

export const CardContent = styled('div', {
  width: '100%',
  variants: {
    size: {
      medium: {
        padding: '0 $12',
        [media.sm]: {
          padding: '0 $8',
        },
      },
      small: {
        padding: '0 $8',
      },
      large: {
        padding: '0 $16',
        [media.sm]: {
          padding: '0 $12',
        },
      },
    },
  },
  defaultVariants: {
    size: 'large',
  },
})
