import { useRecoilValue } from 'recoil'

import { darkThemeColorPalette, lightThemeColorPalette } from '../colors'
import { AppTheme, themeAtom } from '../themeAtom'

export const useColors = () => {
  const { theme } = useRecoilValue(themeAtom)
  return theme === AppTheme.dark
    ? darkThemeColorPalette
    : lightThemeColorPalette
}
