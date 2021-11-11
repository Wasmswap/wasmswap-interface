import { useReducer } from 'react'

export const useStateReducer = <T = any>(initialValue: T) => {
  return useReducer(
    (store, updatedStore) => ({ ...store, ...updatedStore }),
    initialValue
  )
}
