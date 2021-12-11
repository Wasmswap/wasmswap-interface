import { useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from '../state/atoms/walletAtoms'
import { CW20 } from '../services/cw20'
import { getTokenInfo } from './useTokenInfo'
import { useQuery } from 'react-query'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useMemo } from 'react'
import { getIBCAssetInfo } from './useIBCAssetInfo'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from '../util/constants'

async function fetchTokenBalance({
  client,
  tokenSymbol,
  address,
}: {
  client: SigningCosmWasmClient
  tokenSymbol: string
  address: string
}) {
  const tokenInfo = getTokenInfo(tokenSymbol)
  const ibcAssetInfo = getIBCAssetInfo(tokenSymbol)

  if (!tokenInfo && !ibcAssetInfo) {
    throw new Error(
      `Provided tokenSymbol: ${tokenSymbol} doesn't exist on the platform.`
    )
  }

  /*
   * if this is a native asset or an ibc asset that has juno_denom
   *  */
  if (tokenInfo?.native || ibcAssetInfo?.denom) {
    const denom = tokenInfo?.native ? tokenInfo.denom : ibcAssetInfo.juno_denom

    const coin = await client.getBalance(address, denom)
    const amount = coin ? Number(coin.amount) : 0
    return amount / 1000000
  }

  /*
   * everything else
   *  */
  const { token_address } = tokenInfo
  if (token_address) {
    const balance = await CW20(client).use(token_address).balance(address)
    return Number(balance) / 1000000
  }

  return 0
}

export const useTokenBalance = (tokenSymbol: string) => {
  const { address, status, client } = useRecoilValue(walletState)

  const { data: balance = 0, isLoading } = useQuery(
    [`tokenBalance/${tokenSymbol}`, address],
    async () => {
      return await fetchTokenBalance({
        client,
        address,
        tokenSymbol,
      })
    },
    {
      enabled: Boolean(tokenSymbol && status === WalletStatusType.connected),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return { balance, isLoading }
}

export const useMultipleTokenBalance = (tokenSymbols: Array<string>) => {
  const { address, status, client } = useRecoilValue(walletState)

  const queryKey = useMemo(
    () => `multipleTokenBalances/${tokenSymbols.join('+')}`,
    [tokenSymbols]
  )

  const { data, isLoading } = useQuery(
    [queryKey, address],
    async () => {
      const balances = await Promise.all(
        tokenSymbols.map((tokenSymbol) =>
          fetchTokenBalance({
            client,
            address,
            tokenSymbol,
          })
        )
      )

      return tokenSymbols.map((tokenSymbol, index) => ({
        tokenSymbol,
        balance: balances[index],
      }))
    },
    {
      enabled: Boolean(
        status === WalletStatusType.connected && tokenSymbols?.length
      ),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
