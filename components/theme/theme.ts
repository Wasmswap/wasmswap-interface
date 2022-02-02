import { createStitches, createTheme } from '@stitches/react'
import { lightThemeColorTokens, darkThemeColorTokens } from './colors'
import { createSpacing } from './utils/createSpacing'

export const space = createSpacing({
  steps: 22,
  multiplier: 2,
  baseSize: 16,
})

/* build the base theme */
const baseTheme = {
  space,

  fonts: {
    primary:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: '"JetBrains Mono", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  fontSizes: {
    1: '1.625rem',
    2: '1.25rem',
    3: '1rem',
    4: '0.9375rem',
    5: '0.875rem',
    6: '0.8125rem',
    7: '0.75rem',
  },
  fontWeights: {
    bold: 700,
    medium: 600,
    normal: 500,
    light: 400,
  },
  lineHeights: {
    1: '1.75rem',
    2: '1.5rem',
    3: '1.25rem',
    4: '1rem',
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
  media: {
    mobile: '(min-width: 640px)',
    tablet: '(min-width: 768px)',
    desktop: '(min-width: 1024px)',
  },
}

/* build the dark theme */
export const darkTheme = createTheme({
  ...darkThemeColorTokens,
  ...baseTheme,
})

/* build the light theme & configure stitches */
export const {
  theme: lightTheme,
  styled,
  css,
} = createStitches({
  theme: {
    ...lightThemeColorTokens,
    ...baseTheme,
  },
})
