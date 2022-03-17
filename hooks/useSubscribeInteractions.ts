import { useEffect, useRef, useState } from 'react'

export const useSubscribeInteractions = () => {
  const [state, setState] = useState<'active' | 'hovered' | undefined>()
  const ref = useRef<any>(null)

  useEffect(
    () => {
      const node = ref.current

      const handleMouseOver = () => setState('hovered')
      const handleMouseOut = () => setState(undefined)
      const handleMouseDown = () => setState('active')

      if (node) {
        node.addEventListener('mouseover', handleMouseOver)
        node.addEventListener('mouseout', handleMouseOut)
        node.addEventListener('mousedown', handleMouseDown)
        return () => {
          node.removeEventListener('mouseover', handleMouseOver)
          node.removeEventListener('mouseout', handleMouseOut)
          node.removeEventListener('mousedown', handleMouseDown)
        }
      }
    },
    [ref.current] // Recall only if ref changes
  )
  return [ref, state] as const
}
