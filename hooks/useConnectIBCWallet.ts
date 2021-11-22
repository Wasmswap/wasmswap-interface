import { SigningStargateClient } from '@cosmjs/stargate'
import { useSetRecoilState } from 'recoil'
import { ibcWalletState } from '../state/atoms/walletAtoms'
import { getIBCAssetInfo } from './useIBCAssetInfo'
import { useMutation } from 'react-query'

export const useConnectIBCWallet = (
  mutationOptions?: Parameters<typeof useMutation>[2]
) => {
  const setWalletState = useSetRecoilState(ibcWalletState)
  return useMutation(async (tokenSymbol: string) => {
    const { chain_id } = getIBCAssetInfo(tokenSymbol)

    await (window as any).keplr?.enable(chain_id)
    const offlineSigner = await (window as any).getOfflineSigner(chain_id)

    const wasmChainClient = await SigningStargateClient.connectWithSigner(
      'https://cosmoshub.validator.network:443',
      offlineSigner
    )

    const [{ address }] = await offlineSigner.getAccounts()

    setWalletState({
      address,
      client: wasmChainClient,
    })
  }, mutationOptions)
}
