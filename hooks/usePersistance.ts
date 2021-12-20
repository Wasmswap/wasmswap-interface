import { useEffect, useRef } from 'react'

export function usePersistance<T>(value: T) {
  const persistedValue = useRef(value)

  useEffect(() => {
    if (typeof value !== 'undefined') {
      persistedValue.current = value
    }
  }, [value])

  return value || persistedValue.current
}
