import { atom } from 'recoil'
import { __DARK_MODE_ENABLED_BY_DEFAULT__ } from '../../util/constants'
import { localStorageEffect } from '../../util/localStorageEffect'

export enum AppTheme {
  dark = 'dark',
  light = 'light',
}

export const themeAtom = atom<{ theme: AppTheme; touched: boolean }>({
  key: '@theme',
  default: {
    theme: __DARK_MODE_ENABLED_BY_DEFAULT__ ? AppTheme.dark : AppTheme.light,
    touched: false,
  },
  effects_UNSTABLE: [localStorageEffect('@theme')],
})
