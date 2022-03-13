import { useRecoilValue } from 'recoil'
import { AppTheme, themeAtom } from '../themeAtom'
import { darkThemeColorPalette, lightThemeColorPalette } from '../colors'

export const useColors = () => {
  const { theme } = useRecoilValue(themeAtom)
  return theme === AppTheme.dark
    ? darkThemeColorPalette
    : lightThemeColorPalette
}
