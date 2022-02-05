import { useRecoilValue } from 'recoil'
import { darkTheme, lightTheme } from '../theme'
import { AppTheme, themeAtom } from '../themeAtom'

export const useThemeClassName = () => {
  const theme = useRecoilValue(themeAtom)

  if (theme === AppTheme.dark) {
    return darkTheme.className
  }

  return lightTheme.className
}
