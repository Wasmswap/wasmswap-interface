import { useEffect, useRef, useState } from 'react'

export const useIsInteracted = () => {
  const ref = useRef<HTMLElement | SVGElement>()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    function handleMouseEnter() {
      setIsHovered(true)
    }

    function handleMouseLeave() {
      setIsHovered(false)
    }

    function handleMouseDown() {
      setIsClicked(true)
    }

    function handleMouseUp() {
      setIsClicked(false)
    }

    function handleFocus() {
      setIsFocused(true)
    }

    function handleBlur() {
      setIsFocused(false)
    }

    const node = ref.current

    if (node) {
      node.addEventListener('mousedown', handleMouseDown)
      node.addEventListener('mouseup', handleMouseUp)
      node.addEventListener('mouseenter', handleMouseEnter)
      node.addEventListener('mouseleave', handleMouseLeave)
      node.addEventListener('focus', handleFocus)
      node.addEventListener('blur', handleBlur)
    }

    return () => {
      if (node) {
        node.removeEventListener('mousedown', handleMouseDown)
        node.removeEventListener('mouseup', handleMouseUp)
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
        node.removeEventListener('focus', handleFocus)
        node.removeEventListener('blur', handleBlur)
      }
    }
  }, [ref.current])

  return [ref, { isHovered, isFocused, isClicked }] as const
}
