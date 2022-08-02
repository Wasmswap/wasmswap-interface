import { useWallet } from '@noahsaso/cosmodal'
import { usePoolFromListQueryById } from 'queries/usePoolsListQuery'
import { useMutation } from 'react-query'
import { claimTokens } from 'services/staking'

type UseClaimTokensMutationArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useClaimTokens = ({
  poolId,
  ...mutationArgs
}: UseClaimTokensMutationArgs) => {
  const { address, signingCosmWasmClient } = useWallet()
  const [pool] = usePoolFromListQueryById({ poolId })

  return useMutation(
    `claimTokens/${poolId}`,
    async () => {
      return claimTokens(address, pool.staking_address, signingCosmWasmClient)
    },
    mutationArgs
  )
}
