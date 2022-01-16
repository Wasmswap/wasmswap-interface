import { useRecoilValue } from 'recoil'
import { AppTheme, themeAtom } from '../themeAtom'
import { darkTheme, lightTheme } from '../theme'

export const useTheme = () => {
  const theme = useRecoilValue(themeAtom)
  return theme === AppTheme.dark ? darkTheme : lightTheme
}
