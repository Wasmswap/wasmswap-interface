import { SigningStargateClient } from '@cosmjs/stargate'
import { useSetRecoilState } from 'recoil'
import { ibcWalletState } from '../state/atoms/walletAtoms'
import { useIBCAssetInfo } from './useIBCAssetInfo'

export const useConnectIBCWallet = (chainId: string) => {
  const setWalletState = useSetRecoilState(ibcWalletState)
  return async () => {
    console.log(chainId)
    await (window as any).keplr?.enable(chainId)
    const offlineSigner = await (window as any).getOfflineSigner(chainId)
    console.log(offlineSigner);
    console.log("hello");
    const wasmChainClient = await SigningStargateClient.connectWithSigner(
      "https://cosmoshub.validator.network:443",
      offlineSigner
    )

    const [{ address }] = await offlineSigner.getAccounts()

    setWalletState({
      address,
      client: wasmChainClient,
    })
  }
}
