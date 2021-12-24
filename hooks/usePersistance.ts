import { useRef } from 'react'

export function usePersistance<T>(value: T) {
  const persistedValue = useRef(value)

  if (typeof value !== 'undefined') {
    persistedValue.current = value
  }

  return value || persistedValue.current
}
