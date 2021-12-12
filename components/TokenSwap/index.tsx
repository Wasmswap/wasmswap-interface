import { TokenSelector } from './TokenSelector'
import { useRecoilState } from 'recoil'
import { tokenSwapAtom } from './atom'
import { styled } from '@stitches/react'

export const TokenSwap = () => {
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)

  return (
    <StyledDivForWrapper>
      <TokenSelector
        tokenSymbol={tokenA.tokenSymbol}
        amount={tokenA.amount}
        onChange={(updateTokenA) => {
          setTokenSwapState([updateTokenA, tokenB])
        }}
      />
      <TokenSelector
        tokenSymbol={tokenB.tokenSymbol}
        amount={tokenB.amount}
        onChange={(updatedTokenB) => {
          setTokenSwapState([tokenA, updatedTokenB])
        }}
      />
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  marginTop: 100,
  borderRadius: '8px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
})
