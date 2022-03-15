import { useCallback, useRef } from 'react'
import { useQueryClient } from 'react-query'

const sleep = (delayMs: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMs))

export const useRefetchQueries = (
  queryKey?: string | Array<string>,
  delayMs?: number
) => {
  const queryClient = useQueryClient()

  const queriesToRefetchRef = useRef(queryKey)
  queriesToRefetchRef.current = queryKey

  return useCallback(
    async function refetchQueries(queryKeyArg?: string | Array<string>) {
      const queriesToRefetch = queryKeyArg || queriesToRefetchRef.current

      if (delayMs) {
        await sleep(delayMs)
      }

      if (Array.isArray(queriesToRefetch)) {
        return Promise.all<any>(
          queriesToRefetch.map((query) =>
            queryClient.refetchQueries(new RegExp(query) as unknown as string)
          )
        )
      }

      return queryClient.refetchQueries(
        typeof queriesToRefetch === 'string' &&
          (new RegExp(queriesToRefetch) as unknown as string)
      )
    },
    [queryClient, delayMs]
  )
}
