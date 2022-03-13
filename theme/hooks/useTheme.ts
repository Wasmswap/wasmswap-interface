import { useRecoilState, useRecoilValue } from 'recoil'
import { AppTheme, themeAtom } from '../themeAtom'
import { darkTheme, lightTheme } from '../theme'
import { useEffect } from 'react'

export const useTheme = () => {
  const { theme } = useRecoilValue(themeAtom)
  return theme === AppTheme.dark ? darkTheme : lightTheme
}

export const useControlTheme = () => {
  const [{ theme }, setTheme] = useRecoilState(themeAtom)

  return {
    theme,
    set: (value: AppTheme) => {
      setTheme({
        theme: value,
        touched: true,
      })
    },
    setDarkTheme(enabled: boolean) {
      setTheme({
        theme: enabled ? AppTheme.dark : AppTheme.light,
        touched: true,
      })
    },
    setLightTheme(enabled: boolean) {
      setTheme({
        theme: enabled ? AppTheme.light : AppTheme.dark,
        touched: true,
      })
    },
    toggle() {
      setTheme({
        theme: theme === AppTheme.dark ? AppTheme.light : AppTheme.dark,
        touched: true,
      })
    },
  }
}

export const useSubscribeDefaultAppTheme = () => {
  const [{ touched }, setTheme] = useRecoilState(themeAtom)

  useEffect(() => {
    function handleChangeTheme(event) {
      if (event.matches) {
        setTheme({ theme: AppTheme.dark, touched: false })
      } else {
        setTheme({ theme: AppTheme.light, touched: false })
      }
    }

    if (!touched) {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', handleChangeTheme)

      if (media.matches) {
        setTheme({ theme: AppTheme.dark, touched: false })
      }

      return () => {
        media.removeEventListener('change', handleChangeTheme)
      }
    }
  }, [touched, setTheme])
}

export const useThemeClassName = () => {
  const { theme } = useRecoilValue(themeAtom)

  if (theme === AppTheme.dark) {
    return darkTheme.className
  }

  return lightTheme.className
}
