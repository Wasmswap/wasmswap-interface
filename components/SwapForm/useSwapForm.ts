import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState } from '../../state/atoms/walletAtoms'
import { useConnectWallet } from '../../hooks/useConnectWallet'
import { transactionStatusState } from '../../state/atoms/transactionAtoms'
import {
  tokenAmountState,
  tokenANameState,
  tokenBNameState,
} from '../../state/atoms/tokenAtoms'
import { useTokenInfo } from '../../hooks/useTokenInfo'
import { useTokenBalance } from '../../hooks/useTokenBalance'
import { useTokenPrice } from '../../hooks/useTokenPrice'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  swapNativeForToken,
  swapTokenForNative,
  swapTokenForToken,
} from '../../services/swap'
import TokenList from '../../public/token_list.json'

export const useSwapForm = () => {
  const { address, client } = useRecoilValue(walletState)
  const connectWallet = useConnectWallet()

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

  return {
    state: {
      tokenAmount,
      tokenABalance,
      tokenAName,
      tokensList: TokenList.tokens,
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
      handleApplyTokenMaxBalance: tokenABalance
        ? () => {
            setTokenAmount(tokenABalance)
          }
        : undefined,
      handleTokenBNameSelect,
      connectWallet,
    },
  }
}
