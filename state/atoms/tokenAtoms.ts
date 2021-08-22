import { atom } from 'recoil'

export const tokenAState = atom({
  key: 'tokenAState',
  default: {
    amount: 0,
    name: 'JUNO',
  },
})

export const tokenBState = atom({
  key: 'tokenBState',
  default: {
    name: 'POOD',
  },
})
