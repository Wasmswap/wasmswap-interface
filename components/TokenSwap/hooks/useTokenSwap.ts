import { toast } from 'react-toastify'
import {
  swapToken1ForToken2,
  swapToken2ForToken1,
  swapTokenForToken,
} from '../../../services/swap'
import { getBaseToken, getTokenInfo } from '../../../hooks/useTokenInfo'
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
    const baseToken = getBaseToken()

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
        if (tokenASymbol === baseToken.symbol) {
          await swapToken1ForToken2({
            nativeAmount: tokenAmount * 1000000,
            price: tokenToTokenPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            swapAddress: tokenBInfo.swap_address,
            client,
          })
        } else if (tokenBSymbol === baseToken.symbol) {
          await swapToken2ForToken1({
            tokenAmount: tokenAmount * 1000000,
            price: tokenToTokenPrice * 1000000,
            slippage: 0.1,
            senderAddress: address,
            tokenAddress: tokenAInfo.token_address,
            tokenDenom: tokenAInfo.denom,
            swapAddress: tokenAInfo.swap_address,
            token2_native: tokenAInfo.native,
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
            tokenNative: tokenAInfo.native,
            tokenDenom: tokenAInfo.denom,
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
