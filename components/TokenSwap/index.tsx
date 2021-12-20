import { TokenSelector } from './components/TokenSelector'
import { useRecoilState } from 'recoil'
import { tokenSwapAtom } from './tokenSwapAtom'
import { styled } from '@stitches/react'
import { TransactionTips } from './components/TransactionTips'
import { TransactionAction } from './components/TransactionAction'
import { useTokenDollarValue } from '../../hooks/useTokenDollarValue'
import { useTokenToTokenPrice } from './hooks/useTokenToTokenPrice'
import { usePersistance } from '../../hooks/usePersistance'

export const TokenSwap = () => {
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)

  const [[tokenAPrice]] = useTokenDollarValue(
    [tokenA?.tokenSymbol, tokenB?.tokenSymbol].filter(Boolean)
  )

  const [currentTokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount,
  })

  /* persist token price when fetching api */
  const persistTokenPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )

  const tokenPrice =
    (isPriceLoading ? persistTokenPrice : currentTokenPrice) || 0

  const handleSwapTokenPositions = () => {
    setTokenSwapState([
      tokenB ? { ...tokenB, amount: tokenPrice } : tokenB,
      tokenA ? { ...tokenA, amount: tokenB.amount } : tokenA,
    ])
  }

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
          tokenToTokenPrice={tokenPrice}
          onTokenSwaps={handleSwapTokenPositions}
        />
        <TokenSelector
          readOnly
          tokenSymbol={tokenB.tokenSymbol}
          amount={tokenPrice}
          onChange={(updatedTokenB) => {
            setTokenSwapState([tokenA, updatedTokenB])
          }}
        />
      </StyledDivForWrapper>
      <TransactionAction
        isPriceLoading={isPriceLoading}
        tokenToTokenPrice={tokenPrice}
      />
    </>
  )
}

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
})
