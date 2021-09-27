import React from 'react'
import { SwapFormHeading } from './SwapFormStyles'
import { TokenSelector } from '../TokenSelector'
import { SwitchTokensButton } from '../SwitchTokensButton'
import { SwapButton } from '../SwapButton'
import { useSwapForm } from './useSwapForm'

export const SwapFormContent = () => {
  const {
    state: {
      tokenAmount,
      tokenABalance,
      tokenAName,
      tokensList,
      tokenBPrice,
      tokenBBalance,
      tokenBName,
      transactionStatus,
      address,
    },
    actions: {
      handleSwap,
      handleSwitch,
      handleTokenAmountChange,
      handleTokenANameSelect,
      handleApplyTokenMaxBalance,
      handleTokenBNameSelect,
      connectWallet,
    },
  } = useSwapForm()

  return (
    <>
      <SwapFormHeading>Swap</SwapFormHeading>
      <TokenSelector
        amount={tokenAmount}
        balance={tokenABalance}
        tokensList={tokensList}
        tokenName={tokenAName}
        onAmountChange={handleTokenAmountChange}
        onTokenNameSelect={handleTokenANameSelect}
        onApplyMaxBalanceClick={handleApplyTokenMaxBalance}
      />
      <SwitchTokensButton onClick={handleSwitch} />
      <TokenSelector
        amount={tokenBPrice}
        balance={tokenBBalance}
        tokensList={tokensList}
        tokenName={tokenBName}
        onTokenNameSelect={handleTokenBNameSelect}
      />
      <section>
        <SwapButton
          isLoading={transactionStatus === 'EXECUTING_SWAP'}
          onClick={address ? handleSwap : connectWallet}
          label={address ? 'Swap' : 'Connect Wallet'}
        />
      </section>
    </>
  )
}
