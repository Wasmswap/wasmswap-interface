import { useEffect, useRef } from 'react'

export function useOnClickOutside(
  refs: Array<any>,
  handler: (args?: any) => void
) {
  const handlerRef = useRef(handler)

  const initialRefs = useRef(refs).current

  if (initialRefs.length !== refs.length) {
    throw new Error(
      '`refs` array has to persist its length throughout re-renders.'
    )
  }

  useEffect(
    () => {
      if (refs?.length) {
        const listener = (event) => {
          // Do nothing if clicking ref's element or descendent elements
          if (refs.find((ref) => ref?.current?.contains?.(event.target))) {
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
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    refs // eslint-disable-line
  )
}
