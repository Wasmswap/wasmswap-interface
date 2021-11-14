import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useSetRecoilState } from 'recoil'
import { ibcWalletState } from '../state/atoms/walletAtoms'
import { useIBCAssetInfo } from './useIBCAssetInfo'

export const useConnectWallet = (assetSymbol: string) => {
  const setWalletState = useSetRecoilState(ibcWalletState)
  return async () => {
    const assetInfo = useIBCAssetInfo(assetSymbol)
    await (window as any).keplr?.experimentalSuggestChain()
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
    await (window as any).keplr?.enable(chainId)
    const offlineSigner = await (window as any).getOfflineSigner(chainId)

    const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
      process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      offlineSigner
    )

    const [{ address }] = await offlineSigner.getAccounts()

    setWalletState({
      address,
      client: wasmChainClient,
    })
  }
}
