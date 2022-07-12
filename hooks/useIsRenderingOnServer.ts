import { useEffect, useState } from 'react'

export const useIsRenderingOnServer = () => {
  const [isRenderingOnServerSide, setIsRenderingOnServerSide] = useState(true)

  useEffect(() => {
    setIsRenderingOnServerSide(false)
  }, [])

  return isRenderingOnServerSide
}
