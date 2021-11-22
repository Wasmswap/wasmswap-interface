import { chainInfo } from '../public/chain_info'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useSetRecoilState } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useMutation } from 'react-query'

export const useConnectWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const setWalletState = useSetRecoilState(walletState)
  return useMutation(async () => {
    await (window as any).keplr?.experimentalSuggestChain(chainInfo)
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
    await (window as any).keplr?.enable(chainId)
    const offlineSigner = await (window as any).getOfflineSigner(chainId)

    console.log(process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT)
    const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
      process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      offlineSigner
    )

    const [{ address }] = await offlineSigner.getAccounts()

    setWalletState({
      address,
      client: wasmChainClient,
    })
  }, mutationOptions)
}
