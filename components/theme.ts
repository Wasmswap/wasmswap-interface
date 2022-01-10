import { createStitches } from '@stitches/react'
import Color from 'color'

export const colors = createColorPalette({
  black: '#06090B',
  dark: '#191D20',
  light: '#F3F6F8',
  white: '#FFFFFF',
  brand: '#7E5DFF',
  secondary: '#FBBAA4',
  error: '#ED5276',
  valid: '#53D0C9',
})

export const { theme, styled, css } = createStitches({
  theme: {
    colors,

    textColors: {
      white: '$colors$white',
      primary: '$colors$black',
      body: '$colors$dark95',
      secondary: '$colors$dark80',
      tertiary: '$colors$dark60',
      disabled: '$colors$dark40',
      brand: '$colors$brand90',
      error: '$colors$error90',
      valid: '$colors$valid90',
    },

    iconColors: {
      primary: '$colors$dark90',
      secondary: '$colors$dark70',
      tertiary: '$colors$dark50',
      disabled: '$colors$dark30',
      brand: '$colors$brand85',
      error: '$colors$error85',
      valid: '$colors$valid85',
    },

    backgroundColors: {
      base: '$colors$dark0',
      primary: '$colors$dark10',
      secondary: '$colors$dark20',
      tertiary: '$colors$dark30',
      toast: '$colors$dark85',
      tooltip: '$colors$dark95',
      tint: '$colors$secondary20',
      error: '$colors$error15',
      confirm: '$colors$valid20',
    },

    borderColors: {
      inactive: '$colors$dark10',
      default: '$colors$dark20',
      focus: '$colors$dark60',
      selected: '$colors$dark30',
      error: '$colors$error60',
    },

    space: {
      1: '2px',
      2: '4px',
      3: '6px',
      4: '8px',
      5: '10px',
      6: '12px',
      7: '14px',
      8: '16px',
      9: '18px',
      10: '20px',
      11: '22px',
      12: '24px',
      13: '26px',
      14: '28px',
      15: '30px',
      16: '32px',
      17: '34px',
      18: '36px',
      19: '38px',
      20: '40px',
    },

    fonts: {
      primary:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"JetBrains Mono", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    fontSizes: {
      1: '26px',
      2: '20px',
      3: '16px',
      4: '15px',
      5: '14px',
      6: '13px',
      7: '12px',
    },
    fontWeights: {
      bold: 700,
      semiBold: 600,
      normal: 500,
      light: 400,
    },
    lineHeights: {
      1: '28px',
      2: '24px',
      3: '20px',
      4: '16px',
    },
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {
      1: '6px',
      2: '8px',
    },
    shadows: {},
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
  },
})

function createColorPalette(
  colors: Record<string, string>
): Record<string, string> {
  const colorPalette = { ...colors }
  const alphaValues = [
    0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
  ]

  Object.keys(colorPalette).forEach((colorName) => {
    alphaValues.forEach((alphaValue) => {
      colorPalette[`${colorName}${parseInt(String(alphaValue * 100), 10)}`] =
        Color(colorPalette[colorName]).alpha(alphaValue).rgb().string()
    })
  })

  return colorPalette
}
