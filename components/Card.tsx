import { media, styled } from './theme'
import { ComponentPropsWithoutRef } from 'react'

const StyledDivForOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  zIndex: '$1',
})

const StyledDivForContent = styled('div', {
  position: 'relative',
  zIndex: '$2',
})

const StyledDivForCardWrapper = styled('div', {
  $$backgroundColor: '$colors$light',
  $$backgroundColorOnHover: '$colors$light',
  $$backgroundColorOnActive: '$colors$light50',

  $$overlayColor: '$colors$brand0',
  $$overlayColorOnHover: '$colors$brand10',
  $$overlayColorOnActive: '$colors$brand5',

  position: 'relative',
  zIndex: '$1',
  borderRadius: '$2',
  cursor: 'pointer',
  transition: 'background-color 0.1s ease-out, box-shadow 0.1s ease-out',
  backgroundColor: '$$backgroundColor',

  [`${StyledDivForOverlay}`]: {
    transition: 'background-color 0.1s ease-out',
    backgroundColor: '$$overlayColor',
    borderRadius: '$2',
  },

  '&:hover': {
    $$backgroundColor: '$$backgroundColorOnHover',
    $$overlayColor: '$$overlayColorOnHover',
  },

  '&:active': {
    $$backgroundColor: '$$backgroundColorOnActive',
    $$overlayColor: '$$overlayColorOnActive',
  },

  boxShadow: '0 0 0 0 $colors$dark0',
  '&:focus': {
    boxShadow: '0 0 0 2px $borderColors$default',
  },

  variants: {
    disabled: {
      true: {
        $$backgroundColor: '$colors$light60',
        $$backgroundColorOnHover: '$colors$light60',
        $$backgroundColorOnActive: '$colors$light60',

        $$overlayColor: '$colors$brand0',
        $$overlayColorOnHover: '$colors$brand0',
        $$overlayColorOnActive: '$colors$brand0',

        cursor: 'auto',
      },
    },
  },
})

export const Card = ({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof StyledDivForCardWrapper>) => {
  return (
    <StyledDivForCardWrapper {...props} role="button" tabIndex={-1}>
      <StyledDivForOverlay />
      <StyledDivForContent>{children}</StyledDivForContent>
    </StyledDivForCardWrapper>
  )
}

export const CardContent = styled('div', {
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
