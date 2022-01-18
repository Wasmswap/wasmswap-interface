import { styled } from './theme'

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
  padding: '0 $16',
})
