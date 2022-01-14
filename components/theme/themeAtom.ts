import { atom } from 'recoil'

export enum AppTheme {
  dark = 'dark',
  light = 'light',
}

export const themeAtom = atom<AppTheme>({
  key: '@theme',
  default: AppTheme.dark,
})
