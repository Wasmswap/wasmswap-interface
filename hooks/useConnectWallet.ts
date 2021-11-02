import { chainInfo } from '../public/chain_info'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useSetRecoilState } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'

export const useConnectWallet = () => {
  const setWalletState = useSetRecoilState(walletState)
  return async () => {
    await (window as any).keplr?.experimentalSuggestChain(chainInfo)
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
