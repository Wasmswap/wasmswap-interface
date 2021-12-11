import { chainInfo } from '../public/chain_info'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { useMutation } from 'react-query'
import { useEffect } from 'react'

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID

export const useConnectWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status }, setWalletState] = useRecoilState(walletState)
  const mutation = useMutation(async () => {
    if (window && !window?.keplr) {
      alert('Please install Keplr extension and refresh the page.')
      return
    }

    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      client: null,
      state: WalletStatusType.connecting,
    }))

    try {
      await window.keplr.experimentalSuggestChain(chainInfo)
      await window.keplr.enable(chainId)

      const offlineSigner = window.getOfflineSigner(chainId)

      const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
        process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
        offlineSigner
      )

      const [{ address }] = await offlineSigner.getAccounts()
      const key = await window.keplr.getKey(chainId)

      /* successfully update the wallet state */
      setWalletState({
        key,
        address,
        client: wasmChainClient,
        status: WalletStatusType.connected,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        key: null,
        address: '',
        client: null,
        status: WalletStatusType.error,
      })

      /* throw the error for the UI */
      throw e
    }
  }, mutationOptions)

  useEffect(() => {
    /* restore wallet connection if the state has been set with the */
    if (status === WalletStatusType.restored) {
      mutation.mutate(null)
    }
  }, [status]) // eslint-disable-line

  useEffect(() => {
    function reconnectWallet() {
      if (status === WalletStatusType.connected) {
        mutation.mutate(null)
      }
    }

    window.addEventListener('keplr_keystorechange', reconnectWallet)
    return () => {
      window.removeEventListener('keplr_keystorechange', reconnectWallet)
    }
  }, [status]) // eslint-disable-line

  return mutation
}
