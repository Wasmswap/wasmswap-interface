import { usePersistance } from 'junoblocks'
import { useMemo } from 'react'
import { useQueries } from 'react-query'

export function useQueriesDataSelector<
  TQueries extends ReturnType<typeof useQueries>
>(queriesResult: TQueries) {
  const [data, isLoading, isError] = useMemo(() => {
    const loading = queriesResult.some(
      ({ isLoading, data }) => isLoading && !data
    )
    const error = queriesResult.some(({ isError }) => isError)

    const queriesData: Array<TQueries[number]['data']> = queriesResult.map(
      ({ data }) => data
    )

    const didFetchEveryQuery = !queriesData.includes(undefined)

    return [
      didFetchEveryQuery ? queriesData : undefined,
      loading,
      error,
    ] as const
  }, [queriesResult])

  const persistData = usePersistance(data?.[0] ? data : undefined)

  return [persistData, isLoading, isError] as const
}
