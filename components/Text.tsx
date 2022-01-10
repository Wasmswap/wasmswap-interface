import React, { ForwardedRef, forwardRef, ReactNode } from 'react'
import { styled, theme } from './theme'
import type { GetRenderAsProps, RenderAsType } from './types'
import { CSS, VariantProps } from '@stitches/react'

const StyledText = styled('p', {
  fontFamily: '$primary',
  margin: 0,
  padding: 0,

  variants: {
    variant: {
      hero: {
        fontSize: '$1',
        lineHeight: '$1',
        fontWeight: '$bold',
        color: '$textColors$primary',
      },
      header: {
        fontSize: '$2',
        lineHeight: '$2',
        fontWeight: '$semiBold',
        color: '$textColors$primary',
      },
      title: {
        fontSize: '$3',
        lineHeight: '$3',
        fontWeight: '$semiBold',
        color: '$textColors$primary',
      },
      primary: {
        fontSize: '$4',
        lineHeight: '$3',
        fontWeight: '$normal',
        color: '$textColors$body',
      },
      body: {
        fontSize: '$5',
        lineHeight: '$3',
        fontWeight: '$light',
        color: '$textColors$body',
      },
      link: {
        fontSize: '$6',
        lineHeight: '$3',
        fontWeight: '$normal',
        color: '$textColors$body',
      },
      secondary: {
        fontSize: '$6',
        lineHeight: '$4',
        fontWeight: '$light',
        color: '$textColors$secondary',
      },
      legend: {
        fontSize: '$7',
        lineHeight: '$4',
        fontWeight: '$light',
        color: '$textColors$secondary',
        fontFamily: '$mono',
      },
      caption: {
        fontSize: '$7',
        lineHeight: '$4',
        fontWeight: '$light',
        color: '$textColors$tertiary',
      },
    },
    color: Object.assign(
      {
        inherit: {
          color: 'inherit',
        },
      },
      Object.keys(theme.textColors).reduce(
        (colorVariants, textColorName) => ({
          ...colorVariants,
          [textColorName]: {
            color: theme.textColors[textColorName].value,
          },
        }),
        {} as Record<keyof typeof theme['textColors'], { color: string }>
      )
    ),

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
  },

  defaultVariants: {
    variant: 'body',
  },
})

type TextProps<T extends RenderAsType = 'p'> = VariantProps<typeof StyledText> &
  GetRenderAsProps<T> & { css?: CSS } & {
    as?: T
    children?: ReactNode
  }

function TextComponent<T extends RenderAsType = 'p'>(
  { children, as, ...props }: TextProps<T>,
  ref?: ForwardedRef<any>
) {
  return (
    <StyledText ref={ref} as={as} {...props}>
      {children}
    </StyledText>
  )
}

export const Text = forwardRef(TextComponent) as typeof TextComponent
