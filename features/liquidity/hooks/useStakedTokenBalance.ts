import { useWallet } from '@noahsaso/cosmodal'
import { usePoolFromListQueryById } from 'queries/usePoolsListQuery'
import { useQuery } from 'react-query'
import { getProvidedStakedAmount } from 'services/staking'
import { DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL } from 'util/constants'

export const useStakedTokenBalance = ({ poolId, enabled = true }) => {
  const { address, connected, signingCosmWasmClient } = useWallet()

  const [pool] = usePoolFromListQueryById({ poolId })

  const { data = 0, isLoading } = useQuery<number>(
    `stakedTokenBalance/${poolId}/${address}`,
    async () => {
      return Number(
        await getProvidedStakedAmount(
          address,
          pool.staking_address,
          signingCosmWasmClient
        )
      )
    },
    {
      enabled: Boolean(pool?.staking_address && connected && enabled),
      refetchOnMount: 'always',
      refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
      refetchIntervalInBackground: true,
    }
  )

  return [data, isLoading] as const
}
