import { TokenSelector } from './TokenSelector'
import { useRecoilState } from 'recoil'
import { tokenSwapAtom } from './tokenSwapAtom'
import { styled } from '@stitches/react'
import { TransactionTips } from './TransactionTips'
import { TransactionAction } from './TransactionAction'
import { useTokenDollarValue } from '../../hooks/useTokenDollarValue'

export const TokenSwap = () => {
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)

  const [[tokenADollarPrice, tokenBDollarPrice]] = useTokenDollarValue(
    [tokenA?.tokenSymbol, tokenB?.tokenSymbol].filter(Boolean)
  )

  return (
    <>
      <StyledDivForWrapper>
        <TokenSelector
          tokenSymbol={tokenA.tokenSymbol}
          amount={tokenA.amount}
          onChange={(updateTokenA) => {
            setTokenSwapState([updateTokenA, tokenB])
          }}
        />
        <TransactionTips
          dollarValue={(tokenADollarPrice || 0) * (tokenA.amount || 0)}
        />
        <TokenSelector
          tokenSymbol={tokenB.tokenSymbol}
          amount={tokenB.amount}
          onChange={(updatedTokenB) => {
            setTokenSwapState([tokenA, updatedTokenB])
          }}
        />
      </StyledDivForWrapper>
      <TransactionAction
        tokenA={{
          tokenSymbol: tokenA?.tokenSymbol,
          price: tokenADollarPrice,
        }}
        tokenB={{
          tokenSymbol: tokenB?.tokenSymbol,
          price: tokenBDollarPrice,
        }}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
})
