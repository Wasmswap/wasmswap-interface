import { useEffect, useRef } from 'react'

export function useOnClickOutside(ref: any, handler: (args?: any) => void) {
  const handlerRef = useRef(handler)

  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        handlerRef.current(event)
      }
      document.addEventListener('mouseup', listener)
      document.addEventListener('touchend', listener)
      return () => {
        document.removeEventListener('mouseup', listener)
        document.removeEventListener('touchend', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref]
  )
}
