import { toast } from 'react-toastify'
import {
  swapNativeForToken,
  swapTokenForNative,
  swapTokenForToken,
} from '../../../services/swap'
import { getTokenInfo } from '../../../hooks/useTokenInfo'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { transactionStatusState } from '../../../state/atoms/transactionAtoms'
import { walletState } from '../../../state/atoms/walletAtoms'

export const useTokenSwap = ({
  tokenASymbol,
  tokenBSymbol,
  tokenAmount,
  tokenToTokenPrice,
}) => {
  const { client, address } = useRecoilValue(walletState)

  const setTransactionState = useSetRecoilState(transactionStatusState)

  async function swapTokens() {
    const tokenAInfo = getTokenInfo(tokenASymbol)
    const tokenBInfo = getTokenInfo(tokenBSymbol)

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
        if (tokenASymbol === 'JUNO') {
          await swapNativeForToken({
            nativeAmount: tokenAmount * 1000000,
            price: tokenToTokenPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            swapAddress: tokenBInfo.swap_address,
            client,
          })
        } else if (tokenAInfo?.token_address && !tokenBInfo?.token_address) {
          await swapTokenForNative({
            tokenAmount: tokenAmount * 1000000,
            price: tokenToTokenPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            tokenAddress: tokenAInfo.token_address,
            swapAddress: tokenAInfo.swap_address,
            client,
          })
        } else {
          await swapTokenForToken({
            tokenAmount: tokenAmount * 1000000,
            price: tokenToTokenPrice * 1000000,
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

  return swapTokens
}
