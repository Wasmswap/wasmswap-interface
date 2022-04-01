import { createStitches, createTheme } from '@stitches/react'

import { darkThemeColorTokens, lightThemeColorTokens } from './colors'
import { typography } from './typography'
import { createFontVariants } from './utils/createFontVariants'
import { createSpacing } from './utils/createSpacing'

export const space = createSpacing({
  steps: 34,
  multiplier: 2,
  baseSize: 16,
})

export const fontVariants = createFontVariants(typography)

/* build the base theme */
const baseTheme = {
  ...fontVariants,

  space,

  fonts: {
    primary:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"JetBrains Mono", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },

  letterSpacings: {},
  sizes: {},
  borderWidths: {},
  borderStyles: {},
  radii: {
    1: '6px',
    2: '8px',
  },
  shadows: {
    light: '0px $space$1 $space$3 0px $colors$black10',
  },
  zIndices: {
    1: 0,
    2: 1,
    3: 2,
  },

  transitions: {},

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
  },

  media: {
    sm: '(max-width: 876px)',
    md: '(max-width: 1140px)',
    lg: '(min-width: 1140px)',
  },
}

export const media = Object.keys(baseTheme.media).reduce(
  (mediaVariants, key) => ({
    ...mediaVariants,
    [key]: `@media ${baseTheme.media[key]}`,
  }),
  {} as Record<keyof typeof baseTheme.media, string>
)

/* build the dark theme */
export const darkTheme = createTheme({
  ...darkThemeColorTokens,
  ...baseTheme,
})

/* build the light theme & configure stitches */
export const {
  theme: lightTheme,
  globalCss,
  styled,
  css,
} = createStitches({
  theme: {
    ...lightThemeColorTokens,
    ...baseTheme,
  },
})
