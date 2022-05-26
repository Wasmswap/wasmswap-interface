import { usePoolFromListQueryById } from 'queries/usePoolsListQuery'
import { useMutation } from 'react-query'
import { useRecoilValue } from 'recoil'
import { claimTokens } from 'services/staking'
import { walletState } from 'state/atoms/walletAtoms'

type UseClaimTokensMutationArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useClaimTokens = ({
  poolId,
  ...mutationArgs
}: UseClaimTokensMutationArgs) => {
  const { address, client } = useRecoilValue(walletState)
  const [pool] = usePoolFromListQueryById({ poolId })

  return useMutation(
    `claimTokens/${poolId}`,
    async () => {
      return claimTokens(address, pool.staking_address, client)
    },
    mutationArgs
  )
}
