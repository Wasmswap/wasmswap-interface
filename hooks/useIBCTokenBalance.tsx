import { SigningStargateClient } from '@cosmjs/stargate'
import { useWallet } from '@noahsaso/cosmodal'
import { useQuery } from 'react-query'
import { convertMicroDenomToDenom } from 'util/conversion'

import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { useIBCAssetInfo } from './useIBCAssetInfo'

export const useIBCTokenBalance = (tokenSymbol) => {
  const ibcAsset = useIBCAssetInfo(tokenSymbol)

  const { walletClient, address: nativeWalletAddress } = useWallet()

  const { data: balance = 0, isLoading } = useQuery(
    [
      `ibcTokenBalance/${tokenSymbol}`,
      nativeWalletAddress,
      Boolean(walletClient),
    ],
    async () => {
      const { denom, decimals, chain_id, rpc } = ibcAsset

      await walletClient.enable(chain_id)
      const offlineSigner = await walletClient.getOfflineSigner(chain_id)

      const [wasmChainClient, [{ address }]] = await Promise.all([
        SigningStargateClient.connect(rpc),
        offlineSigner.getAccounts(),
      ])

      const coin = await wasmChainClient.getBalance(address, denom)

      const amount = coin ? Number(coin.amount) : 0
      return convertMicroDenomToDenom(amount, decimals)
    },
    {
      enabled: Boolean(nativeWalletAddress && ibcAsset && walletClient),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, isLoading: isLoading }
}
