import { TokenSelector } from './components/TokenSelector'
import { useRecoilState } from 'recoil'
import { tokenSwapAtom } from './tokenSwapAtom'
import { styled } from '@stitches/react'
import { TransactionTips } from './components/TransactionTips'
import { TransactionAction } from './components/TransactionAction'
import { useTokenDollarValue } from '../../hooks/useTokenDollarValue'
import { useTokenToTokenPrice } from './hooks/useTokenToTokenPrice'

export const TokenSwap = () => {
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)

  const [[tokenAPrice, tokenBPrice]] = useTokenDollarValue(
    [tokenA?.tokenSymbol, tokenB?.tokenSymbol].filter(Boolean)
  )

  const [tokenPrice] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount,
  })

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
          dollarValue={(tokenAPrice || 0) * (tokenA.amount || 0)}
        />
        <TokenSelector
          readOnly
          tokenSymbol={tokenB.tokenSymbol}
          amount={tokenPrice || 0}
          onChange={(updatedTokenB) => {
            setTokenSwapState([tokenA, updatedTokenB])
          }}
        />
      </StyledDivForWrapper>
      <TransactionAction
        tokenAPrice={tokenAPrice}
        tokenBPrice={tokenBPrice}
        tokenToTokenPrice={tokenPrice || 0}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
})
