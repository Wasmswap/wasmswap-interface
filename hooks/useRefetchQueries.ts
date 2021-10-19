import { useQueryClient } from 'react-query'
import { useCallback } from 'react'

export const useRefetchQueries = () => {
  const queryClient = useQueryClient()
  return useCallback(
    function refetchQueries() {
      queryClient.refetchQueries()
    },
    [queryClient]
  )
}
