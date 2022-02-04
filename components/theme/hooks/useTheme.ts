import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { AppTheme, themeAtom } from '../themeAtom'
import { darkTheme, lightTheme } from '../theme'
import { useEffect } from 'react'

export const useTheme = () => {
  const theme = useRecoilValue(themeAtom)
  return theme === AppTheme.dark ? darkTheme : lightTheme
}

export const useControlTheme = () => {
  const [theme, setTheme] = useRecoilState(themeAtom)

  return {
    theme,
    set: setTheme,
    setDarkTheme(enabled: boolean) {
      setTheme(enabled ? AppTheme.dark : AppTheme.light)
    },
    toggle() {
      setTheme(theme === AppTheme.dark ? AppTheme.light : AppTheme.dark)
    },
  }
}

export const useSubscribeDefaultAppTheme = () => {
  const setTheme = useSetRecoilState(themeAtom)

  useEffect(() => {
    function handleChangeTheme(event) {
      if (event.matches) {
        setTheme(AppTheme.dark)
      } else {
        setTheme(AppTheme.light)
      }
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', handleChangeTheme)

    if (media.matches) {
      setTheme(AppTheme.dark)
    }

    return () => {
      media.removeEventListener('change', handleChangeTheme)
    }
  }, [setTheme])
}
