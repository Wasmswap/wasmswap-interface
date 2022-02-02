import { media, styled } from './theme'

export const Card = styled('div', {
  borderRadius: '$2',
  variants: {
    active: {
      true: {
        backgroundColor: '$colors$white',
        border: '1px solid $borderColors$default',
        boxShadow: '$light',
      },
      false: {
        cursor: 'pointer',
        transition: 'background-color 0.1s ease-out',
        backgroundColor: '$backgroundColors$primary',
        '&:hover': {
          backgroundColor: '$colors$dark15',
        },
        '&:active': {
          backgroundColor: '$colors$dark5',
        },
      },
    },
  },
  defaultVariants: {
    active: false,
  },
})

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
