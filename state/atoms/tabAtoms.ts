import { atom } from 'recoil'

export const tabsConfig = [
  { label: 'Swap', value: 'swap' },
  { label: 'Pools', value: 'pools' },
]

export const tabValueState = atom<string>({
  key: 'tabValueState',
  default: tabsConfig[0].value,
})
