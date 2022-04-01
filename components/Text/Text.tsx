import { CSS, VariantProps } from '@stitches/react'
import React, { ForwardedRef, forwardRef, ReactNode } from 'react'
import { createColorVariants, styled } from 'theme'
import { typography } from 'theme/typography'

import type { GetRenderAsProps, RenderAsType } from '../types'
import { createTypographyVariantsForText } from './createTypographyVariantsForText'

const StyledText = styled('p', {
  fontFamily: '$primary',
  margin: 0,
  padding: 0,

  $$color: '$textColors$primary',
  color: '$$color',

  variants: {
    variant: createTypographyVariantsForText(),

    color: createColorVariants('textColors', (colorToken) => ({
      $$color: `$textColors$${colorToken} !important`,
    })),

    transform: {
      uppercase: {
        textTransform: 'uppercase',
      },
      lowercase: {
        textTransform: 'lowercase',
      },
      capitalize: {
        textTransform: 'capitalize',
      },
    },

    wrap: {
      true: {},
      false: {
        whiteSpace: 'pre',
      },
    },

    truncate: {
      true: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },

    align: {
      left: {
        textAlign: 'left',
      },
      center: {
        textAlign: 'center',
      },
      right: {
        textAlign: 'right',
      },
    },
  },
})

type TypographyVariants = keyof typeof typography

type TextProps<
  T extends RenderAsType = 'p',
  K extends TypographyVariants = 'product'
> = Omit<VariantProps<typeof StyledText>, 'variant'> &
  GetRenderAsProps<T> & { css?: CSS } & {
    as?: T
    children?: ReactNode
    kind?: K
    variant?: keyof typeof typography[K]
  }

function TextComponent<
  T extends RenderAsType = 'p',
  K extends TypographyVariants = 'product'
>(
  {
    children,
    as,
    kind = 'product',
    variant = 'body',
    ...props
  }: TextProps<T, K>,
  ref?: ForwardedRef<any>
) {
  return (
    <StyledText ref={ref} as={as} variant={`${kind}__${variant}`} {...props}>
      {children}
    </StyledText>
  )
}

export const Text = forwardRef(TextComponent) as typeof TextComponent
