import { useEffect, useState } from 'react'

export const useDelayedAppearanceFlag = (
  isShowing: boolean,
  delayMs: number = 350
) => {
  const [isShowingDelayed, setIsShowingDelayed] = useState(false)

  useEffect(() => {
    if (isShowing) {
      let timeout = setTimeout(() => {
        setIsShowingDelayed(true)
      }, delayMs)

      return () => clearTimeout(timeout)
    }

    setIsShowingDelayed(false)
  }, [isShowing, delayMs])

  return isShowingDelayed
}
