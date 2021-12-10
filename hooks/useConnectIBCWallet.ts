import { SigningStargateClient } from '@cosmjs/stargate'
import { useRecoilState } from 'recoil'
import { ibcWalletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { getIBCAssetInfo } from './useIBCAssetInfo'
import { useMutation } from 'react-query'
import { useEffect } from 'react'

/* shares very similar logic with `useConnectWallet` and is a subject to refactpr */
export const useConnectIBCWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const [{ status, tokenSymbol: storedTokenSymbol }, setWalletState] =
    useRecoilState(ibcWalletState)

  const mutation = useMutation(async (tokenSymbol: string) => {
    if (window && !window?.keplr) {
      alert('Please install Keplr extension and refresh the app.')
      return
    }

    if (!tokenSymbol) {
      throw new Error('Please provide tokenSymbol')
    }

    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      tokenSymbol,
      client: null,
      state: WalletStatusType.connecting,
    }))

    try {
      const { chain_id } = getIBCAssetInfo(tokenSymbol)

      await window.keplr.enable(chain_id)
      const offlineSigner = await window.getOfflineSigner(chain_id)

      const wasmChainClient = await SigningStargateClient.connectWithSigner(
        'https://cosmoshub.validator.network:443',
        offlineSigner
      )

      const [{ address }] = await offlineSigner.getAccounts()

      /* successfully update the wallet state */
      setWalletState({
        tokenSymbol,
        address,
        client: wasmChainClient,
        status: WalletStatusType.connected,
      })
    } catch (e) {
      /* set the error state */
      setWalletState({
        tokenSymbol: null,
        address: '',
        client: null,
        status: WalletStatusType.error,
      })

      throw e
    }
  }, mutationOptions)

  useEffect(() => {
    /* restore wallet connection if the state has been set with the */
    if (status === WalletStatusType.restored && storedTokenSymbol) {
      mutation.mutate(storedTokenSymbol)
    }
  }, [status, mutation.mutate, storedTokenSymbol])

  useEffect(() => {
    function reconnectWallet() {
      if (storedTokenSymbol && status === WalletStatusType.connected) {
        mutation.mutate(storedTokenSymbol)
      }
    }

    window.addEventListener('keplr_keystorechange', reconnectWallet)
    return () => {
      window.removeEventListener('keplr_keystorechange', reconnectWallet)
    }
  }, [storedTokenSymbol, status]) // eslint-disable-line

  return mutation
}
