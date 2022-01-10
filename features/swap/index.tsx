import { styled } from 'components/theme'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { usePersistance } from 'hooks/usePersistance'
import { TokenSelector } from './components/TokenSelector'
import { TransactionTips } from './components/TransactionTips'
import { TransactionAction } from './components/TransactionAction'
import { useTokenToTokenPrice } from './hooks/useTokenToTokenPrice'
import { tokenSwapAtom } from './swapAtoms'
import { useTokenList } from '../../hooks/useTokenList'
import { useEffect } from 'react'

export const TokenSwap = () => {
  /* connect to recoil */
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)
  const transactionStatus = useRecoilValue(transactionStatusState)

  /* fetch token list and set initial state */
  const [tokenList, isTokenListLoading] = useTokenList()
  useEffect(() => {
    const shouldSetDefaultTokenAState =
      !tokenA.tokenSymbol && !tokenB.tokenSymbol && tokenList
    if (shouldSetDefaultTokenAState) {
      setTokenSwapState([
        {
          tokenSymbol: tokenList.base_token.symbol,
          amount: tokenA.amount || 0,
        },
        tokenB,
      ])
    }
  }, [tokenList, tokenA, tokenB, setTokenSwapState])

  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING || isTokenListLoading

  /* fetch token to token price */
  const [currentTokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount,
  })

  /* persist token price when querying a new one */
  const persistTokenPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )

  /* select token price */
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
          disabled={isUiDisabled}
        />
        <TransactionTips
          disabled={isUiDisabled}
          isPriceLoading={isPriceLoading}
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
          disabled={isUiDisabled}
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
