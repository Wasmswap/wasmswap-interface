import { atom } from 'recoil'
import { __DARK_MODE_ENABLED_BY_DEFAULT__ } from '../../util/constants'

export enum AppTheme {
  dark = 'dark',
  light = 'light',
}

export const themeAtom = atom<AppTheme>({
  key: '@theme',
  default: AppTheme.light,
})
