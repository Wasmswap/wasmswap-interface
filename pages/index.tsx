import React from 'react'
import { swapNativeForToken, swapTokenForNative, increaseTokenAllowance } from 'services/swap'
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
import { AllowanceButton } from 'components/AllowanceButton'

export default function Home() {
  const { address, client } = useRecoilValue(walletState)

  const [transactionStatus, setTransactionState] = useRecoilState(
    transactionStatusState
  )

  const resetTransactionState = () => {
    setTransactionState('IDLE')
  }

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


  const handleTokenANameSelect = (value: string) => {
    if(value !== 'JUNO' && tokenBName != 'JUNO') {
      toast.error('One token must be set to JUNO', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }) 
      return
    }
    setTokenAmount(0)
    if (value === tokenBName) {
      setTokenBName(tokenAName)
    }
    setTokenAName(value)
    resetTransactionState()
  }

  const handleTokenAmountChange = (val: number) => {
    setTokenAmount(val)
    resetTransactionState()
  }


  const handleTokenBNameSelect = (value: string) => {
    if(value !== 'JUNO' && tokenAName != 'JUNO') {
      toast.error('One token must be set to JUNO', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }) 
      return
    }
    if (value === tokenAName) {
      setTokenAName(tokenBName)
    }
    setTokenBName(value)
    resetTransactionState()
  }

  const handleSwitch = () => {
    setTokenAName(tokenBName)
    setTokenBName(tokenAName)
    setTokenAmount(tokenBPrice)
    resetTransactionState()
  }

  const approveAllowance = async () => {
    if (client == undefined) {
      toast.error('Please connect wallet', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return
    } 
    try {
      setTransactionState('APPROVING_ALLOWANCE')
      await increaseTokenAllowance({
        tokenAmount: tokenAmount * 1000000,
        senderAddress: address,
        tokenAddress: tokenAInfo.token_address,
        swapAddress: tokenAInfo.swap_address,
        client
      })
      toast.success('Permissions Succesful', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setTransactionState('ALLOWANCE_APPROVED')
  } catch (e) {
    toast.error(`Error with granting permissions ${e}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
    console.log(e)
    resetTransactionState()
  }
  }

  // TODO don't hardwire everything, just for testing
  const handleSwap = async () => {
    console.log(client)
    if (client == undefined) {
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
      console.log(tokenBPrice)
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
        } else {
            await swapTokenForNative({
              tokenAmount: tokenAmount * 1000000,
              price: tokenBPrice * 1000000,
              slippage: 0.1,
              senderAddress: address,
              tokenAddress: tokenAInfo.token_address,
              swapAddress: tokenAInfo.swap_address,
              client,
            })
        }
        toast.success('🎉 Swap Succesful', {
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
      }
      resetTransactionState()
    }
  }

  return (
    <div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            Swap
            <div>
              <TokenSelector
                amount={tokenAmount}
                balance={tokenABalance}
                tokensList={TokenList.tokens}
                tokenName={tokenAName}
                onAmountChange={handleTokenAmountChange}
                onTokenNameSelect={handleTokenANameSelect}
              />
              <SwitchTokensButton onClick={handleSwitch} />
              <TokenSelector
                amount={tokenBPrice}
                balance={tokenBBalance}
                tokensList={TokenList.tokens}
                tokenName={tokenBName}
                onTokenNameSelect={handleTokenBNameSelect}
              />
            </div>
            <AllowanceButton
                tokenName={tokenAName}
                isVisible={tokenAName !== "JUNO"}
                isLoading={transactionStatus === 'APPROVING_ALLOWANCE'}
                isActive={transactionStatus === 'IDLE'}
                onClick={approveAllowance}
              />
            <div>
              <SwapButton
                isLoading={transactionStatus === 'EXECUTING_SWAP'}
                isActive={tokenAName === "JUNO" || transactionStatus === 'ALLOWANCE_APPROVED'}
                onClick={handleSwap}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
