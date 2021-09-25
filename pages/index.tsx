import React, { useEffect, useRef, useState } from 'react'
import {
  swapNativeForToken,
  swapTokenForNative,
  swapTokenForToken,
} from 'services/swap'
import TokenList from 'public/token_list.json'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  tokenAmountState,
  tokenANameState,
  tokenBNameState,
} from '../state/atoms/tokenAtoms'
import { useTokenBalance } from '../hooks/useTokenBalance'
import { transactionStatusState } from '../state/atoms/transactionAtoms'
import { useTokenPrice } from '../hooks/useTokenPrice'
import { walletState } from '../state/atoms/walletAtoms'
import { TokenSelector } from '../components/TokenSelector'
import { SwitchTokensButton } from '../components/SwitchTokensButton'
import { SwapButton } from '../components/SwapButton'
import { useTokenInfo } from 'hooks/useTokenInfo'
import {
  SwapFormHeading,
  SwapFormFrame,
  SwapFormSegmentedController,
} from '../components/SwapForm/SwapFormStyles'
import { Disclaimer } from '../components/SwapForm/Disclaimer'
import { useConnectWallet } from '../hooks/useConnectWallet'

export default function Home() {
  const { address, client } = useRecoilValue(walletState)
  const connectWallet = useConnectWallet()

  const segmentedControllerTabs = useRef([
    { label: 'Swap', value: 'swap' },
    { label: 'Pools', value: 'pools' },
  ]).current
  const [currentTab, setTab] = useState(segmentedControllerTabs[0].value)

  const [transactionStatus, setTransactionState] = useRecoilState(
    transactionStatusState
  )
  // Token A related states
  const [tokenAName, setTokenAName] = useRecoilState(tokenANameState)
  const [tokenAmount, setTokenAmount] = useRecoilState(tokenAmountState)
  const tokenAInfo = useTokenInfo(tokenAName)
  const tokenABalance = useTokenBalance(tokenAInfo)

  // Token B related states
  const [tokenBName, setTokenBName] = useRecoilState(tokenBNameState)
  const tokenBInfo = useTokenInfo(tokenBName)
  const tokenBPrice = useTokenPrice(tokenAInfo, tokenBInfo, tokenAmount)
  const tokenBBalance = useTokenBalance(tokenBInfo)

  // Reset transaction state everytime token names or amount names change
  useEffect(() => {
    setTransactionState('IDLE')
  }, [tokenAName, tokenAmount, tokenBName, setTransactionState])

  const handleTokenANameSelect = (value: string) => {
    setTokenAmount(0)
    if (value === tokenBName) {
      setTokenBName(tokenAName)
    }
    setTokenAName(value)
  }

  const handleTokenAmountChange = (val: number) => {
    setTokenAmount(val)
  }

  const handleTokenBNameSelect = (value: string) => {
    if (value === tokenAName) {
      setTokenAName(tokenBName)
    }
    setTokenBName(value)
  }

  const handleSwitch = () => {
    setTokenAName(tokenBName)
    setTokenBName(tokenAName)
    setTokenAmount(tokenBPrice)
  }

  const handleSwap = async () => {
    if (!client) {
      toast.error('Please connect wallet', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      setTransactionState('EXECUTING_SWAP')
      try {
        if (tokenAName === 'JUNO') {
          await swapNativeForToken({
            nativeAmount: tokenAmount * 1000000,
            price: tokenBPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            swapAddress: tokenBInfo.swap_address,
            client,
          })
        } else if (tokenAInfo.token_address && !tokenBInfo.token_address) {
          await swapTokenForNative({
            tokenAmount: tokenAmount * 1000000,
            price: tokenBPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            tokenAddress: tokenAInfo.token_address,
            swapAddress: tokenAInfo.swap_address,
            client,
          })
        } else {
          await swapTokenForToken({
            tokenAmount: tokenAmount * 1000000,
            price: tokenBPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            tokenAddress: tokenAInfo.token_address,
            swapAddress: tokenAInfo.swap_address,
            outputSwapAddress: tokenBInfo.swap_address,
            client,
          })
        }
        toast.success('🎉 Swap Successful', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } catch (e) {
        toast.error(`Error with swap ${e}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } finally {
        setTransactionState('IDLE')
      }
    }
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <SwapFormSegmentedController
        tabs={segmentedControllerTabs}
        currentTab={currentTab}
        onChangeTab={(tab) => setTab(tab)}
      />
      <SwapFormFrame>
        <SwapFormHeading>Swap</SwapFormHeading>
        <TokenSelector
          amount={tokenAmount}
          balance={tokenABalance}
          tokensList={TokenList.tokens}
          tokenName={tokenAName}
          onAmountChange={handleTokenAmountChange}
          onTokenNameSelect={handleTokenANameSelect}
          onApplyMaxBalanceClick={
            tokenABalance
              ? () => {
                  setTokenAmount(tokenABalance)
                }
              : undefined
          }
        />
        <SwitchTokensButton onClick={handleSwitch} />
        <TokenSelector
          amount={tokenBPrice}
          balance={tokenBBalance}
          tokensList={TokenList.tokens}
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
      </SwapFormFrame>
      <Disclaimer delayMs={3000}>
        Wasmswap is currently in beta and operating on the Juno testnet. Keplr
        connected to a ledger is currently unsupported.
      </Disclaimer>
    </div>
  )
}
