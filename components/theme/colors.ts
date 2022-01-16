import { createColorPalette } from './utils/createColorPalette'

/* base theme for the app is the light theme */
export const lightThemeColors = {
  black: '#06090B',
  dark: '#191D20',
  light: '#F3F6F8',
  white: '#FFFFFF',
  brand: '#7E5DFF',
  secondary: '#FBBAA4',
  error: '#ED5276',
  valid: '#53D0C9',
}

/* invert light theme main tokens to get the dark theme tokens */
export const darkThemeColors = {
  ...lightThemeColors,
  white: lightThemeColors.black,
  black: lightThemeColors.white,
  light: lightThemeColors.dark,
  dark: lightThemeColors.light,
}

/* build theme color tokens */
export const themeColorTokens = {
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
    base: '$colors$white',
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
}

/* light theme palette */
export const lightThemeColorPalette = createColorPalette(lightThemeColors)
export const lightThemeColorTokens = {
  colors: lightThemeColorPalette,
  ...themeColorTokens,
}

/* dark theme palette */
export const darkThemeColorPalette = createColorPalette(darkThemeColors)
export const darkThemeColorTokens = {
  colors: darkThemeColorPalette,
  ...themeColorTokens,
}
