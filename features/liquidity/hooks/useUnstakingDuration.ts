import { useChainInfo } from 'hooks/useChainInfo'
import { useQuery } from 'react-query'
import { getUnstakingDuration } from 'services/staking'
import { WalletStatusType } from 'state/atoms/walletAtoms'

import {
  PoolEntityType,
  usePoolFromListQuery,
} from '../../../queries/usePoolsListQuery'
import { cosmWasmClientRouter } from '../../../util/cosmWasmClientRouter'

type UseUnstakingDurationArgs = {
  poolId: PoolEntityType['pool_id']
}

export const useUnstakingDuration = ({ poolId }: UseUnstakingDurationArgs) => {
  const [pool] = usePoolFromListQuery({ poolId })
  const [chainInfo] = useChainInfo()

  const { data = 0, isLoading } = useQuery(
    `unstakingDuration/${poolId}`,
    async () => {
      const client = await cosmWasmClientRouter.connect(chainInfo.rpc)
      return getUnstakingDuration(pool?.staking_address, client)
    },
    {
      enabled: Boolean(
        pool?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return [data, isLoading] as const
}
