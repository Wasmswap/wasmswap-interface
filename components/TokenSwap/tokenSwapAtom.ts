import { atom } from 'recoil'

type TokenItemState = {
  tokenSymbol: string
  amount: number
}

export const tokenSwapAtom = atom<[TokenItemState, TokenItemState]>({
  key: 'tokenSwap',
  default: [
    {
      tokenSymbol: 'JUNO',
      amount: 0,
    },
    {
      tokenSymbol: 'ATOM',
      amount: 0,
    },
  ],
  effects_UNSTABLE: [
    function validateIfTokensAreSame({ onSet, setSelf }) {
      onSet((newValue, oldValue) => {
        const [tokenA, tokenB] = newValue
        if (tokenA.tokenSymbol === tokenB.tokenSymbol) {
          requestAnimationFrame(() => {
            setSelf([oldValue[1], oldValue[0]])
          })
        }
      })
    },
  ],
})
