import { VariantProps } from '@stitches/react'
import { ComponentPropsWithoutRef } from 'react'

import { styled } from '../theme'

const StyledImageForLogo = styled('img', {
  borderRadius: '50%',
  flexShrink: 0,
  flexGrow: 0,
  border: '1px solid $borderColors$inactive',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$backgroundColors$disabled',
  variants: {
    size: {
      small: {
        width: '0.5rem',
        height: '0.5rem',
      },
      medium: {
        width: '1rem',
        height: '1rem',
      },
      large: {
        width: '1.5rem',
        height: '1.5rem',
      },
      big: {
        width: '2rem',
        height: '2rem',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

type ImageForTokenLogoProps = VariantProps<typeof StyledImageForLogo> &
  ComponentPropsWithoutRef<typeof StyledImageForLogo> & {
    logoURI?: string | null
  }

export const ImageForTokenLogo = ({
  logoURI,
  ...props
}: ImageForTokenLogoProps) => {
  return (
    <StyledImageForLogo
      as={logoURI ? 'img' : 'div'}
      src={logoURI}
      loading="lazy"
      {...props}
    />
  )
}

ImageForTokenLogo.toString = StyledImageForLogo.toString
