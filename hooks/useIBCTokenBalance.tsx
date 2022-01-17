import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'
import { useQuery } from 'react-query'
import { getIBCAssetInfo } from './useIBCAssetInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'
import { convertMicroDenomToDenom } from 'util/conversion'
import { SigningStargateClient } from '@cosmjs/stargate'

export const useIBCTokenBalance = (tokenSymbol) => {
  const { address: nativeWalletAddress } = useRecoilValue(walletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`ibcTokenBalance/${tokenSymbol}`, nativeWalletAddress],
    async () => {
      const { denom, decimals, chain_id, rpc } = getIBCAssetInfo(tokenSymbol)

      await window.keplr.enable(chain_id)
      const offlineSigner = await window.getOfflineSigner(chain_id)

      const wasmChainClient = await SigningStargateClient.connectWithSigner(
        rpc,
        offlineSigner
      )

      const [{ address }] = await offlineSigner.getAccounts()
      const coin = await wasmChainClient.getBalance(address, denom)

      const amount = coin ? Number(coin.amount) : 0
      return convertMicroDenomToDenom(amount, decimals)
    },
    {
      enabled: Boolean(nativeWalletAddress),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, isLoading: isLoading }
}
