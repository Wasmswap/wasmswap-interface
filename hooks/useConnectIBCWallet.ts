import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate'
import {
  AminoTypes,
  createIbcAminoConverters,
  GasPrice,
  SigningStargateClient,
} from '@cosmjs/stargate'
import { useWallet } from '@noahsaso/cosmodal'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState } from 'recoil'

import { ibcWalletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { GAS_PRICE } from '../util/constants'
import { useIBCAssetInfo } from './useIBCAssetInfo'

/* shares very similar logic with `useConnectWallet` and is a subject to refactor */
export const useConnectIBCWallet = (
  tokenSymbol: string,
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const { walletClient, connected } = useWallet()

  const [{ status, tokenSymbol: storedTokenSymbol }, setWalletState] =
    useRecoilState(ibcWalletState)

  const assetInfo = useIBCAssetInfo(tokenSymbol || storedTokenSymbol)

  const mutation = useMutation(async () => {
    if (window && !window?.keplr) {
      alert('Please install Keplr extension and refresh the page.')
      return
    }

    if (!tokenSymbol && !storedTokenSymbol) {
      throw new Error(
        'You must provide `tokenSymbol` before connecting to the wallet.'
      )
    }

    if (!assetInfo) {
      throw new Error(
        'Asset info for the provided `tokenSymbol` was not found. Check your internet connection.'
      )
    }

    /* set the fetching state */
    setWalletState((value) => ({
      ...value,
      tokenSymbol,
      client: null,
      state: WalletStatusType.connecting,
    }))

    try {
      const { chain_id, rpc } = assetInfo

      await walletClient.enable(chain_id)
      const offlineSigner = await walletClient.getOfflineSigner(chain_id)

      const wasmChainClient = await SigningStargateClient.connectWithSigner(
        rpc,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE),
          /* passing ibc amino types to make ibc work on amino signers (eg ledger, wallet connect) */
          aminoTypes: new AminoTypes(
            Object.assign(
              createIbcAminoConverters(),
              createWasmAminoConverters()
            )
          ),
        }
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

  const connectWallet = mutation.mutate

  const readyToRestoreConnection = assetInfo && walletClient && connected
  useEffect(() => {
    /* restore wallet connection */
    if (status === WalletStatusType.restored && readyToRestoreConnection) {
      connectWallet(null)
    }
  }, [status, connectWallet, readyToRestoreConnection])

  useEffect(() => {
    function reconnectWallet() {
      if (assetInfo && status === WalletStatusType.connected) {
        connectWallet(null)
      }
    }

    window.addEventListener('keplr_keystorechange', reconnectWallet)
    return () => {
      window.removeEventListener('keplr_keystorechange', reconnectWallet)
    }
  }, [connectWallet, status, assetInfo])

  return mutation
}
