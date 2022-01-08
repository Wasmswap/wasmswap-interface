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
      primary: '$black',
      body: '$dark$95',
      secondary: '$dark$80',
      tertiary: '$dark$60',
      disabled: '$dark$40',
      brand: '$brand$90',
      error: '$error$90',
      valid: '$valid$90',
    },

    iconColors: {
      primary: Color(colors.dark).alpha(0.9).rgb().string(),
      secondary: Color(colors.dark).alpha(0.7).rgb().string(),
      tertiary: Color(colors.dark).alpha(0.5).rgb().string(),
      disabled: Color(colors.dark).alpha(0.3).rgb().string(),
      brand: Color(colors.brand).alpha(0.85).rgb().string(),
      error: Color(colors.error).alpha(0.85).rgb().string(),
      valid: Color(colors.valid).alpha(0.85).rgb().string(),
    },

    backgroundColors: {
      base: Color(colors.dark).alpha(0).rgb().string(),
      primary: Color(colors.dark).alpha(0.1).rgb().string(),
      secondary: Color(colors.dark).alpha(0.2).rgb().string(),
      tertiary: Color(colors.dark).alpha(0.3).rgb().string(),
      toast: Color(colors.dark).alpha(0.85).rgb().string(),
      tooltip: Color(colors.dark).alpha(0.95).rgb().string(),
      tint: Color(colors.secondary).alpha(0.2).rgb().string(),
      error: Color(colors.error).alpha(0.15).rgb().string(),
      confirm: Color(colors.valid).alpha(0.2).rgb().string(),
    },

    borderColors: {
      inactive: Color(colors.dark).alpha(0.1).rgb().string(),
      default: Color(colors.dark).alpha(0.2).rgb().string(),
      focus: Color(colors.dark).alpha(0.6).rgb().string(),
      selected: Color(colors.dark).alpha(0.3).rgb().string(),
      error: Color(colors.error).alpha(0.6).rgb().string(),
    },

    spaces: {
      1: '2px',
      2: '4px',
      3: '8px',
      4: '12px',
      5: '14px',
      6: '16px',
      7: '18px',
      8: '20px',
      9: '22px',
      10: '24px',
      11: '28px',
      12: '32px',
    },

    fonts: {
      primary:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      mono: '"JetBrains Mono", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
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
    0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7,
    0.75, 0.8, 0.85, 0.9, 0.95,
  ]

  Object.keys(colorPalette).forEach((colorName) => {
    alphaValues.forEach((alphaValue) => {
      colorPalette[`${colorName}$${parseInt(String(alphaValue * 100), 10)}`] =
        Color(colorPalette[colorName]).alpha(alphaValue).rgb().string()
    })
  })

  return colorPalette
}
