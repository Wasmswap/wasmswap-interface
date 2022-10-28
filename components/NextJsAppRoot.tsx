import {
  globalCss,
  styled,
  useSubscribeDefaultAppTheme,
  useThemeClassName,
} from 'junoblocks'
import { useEffect, useState } from 'react'

import { __KEPLR_PREFER_NO_SET_FEE__ } from '../util/constants'

const applyGlobalStyles = globalCss({
  body: {
    backgroundColor: '$backgroundColors$base',
  },
})

const useIsRenderingOnServerSide = () => {
  const [isRenderingOnServerSide, setIsRenderingOnServerSide] = useState(true)

  useEffect(() => {
    setIsRenderingOnServerSide(false)
  }, [])

  return isRenderingOnServerSide
}

export function NextJsAppRoot({ children }) {
  const isRenderingOnServerSide = useIsRenderingOnServerSide()

  const themeClassName = useThemeClassName()
  useSubscribeDefaultAppTheme()

  /* disable gas auto feature flag */
  useEffect(() => {
    if (__KEPLR_PREFER_NO_SET_FEE__) {
      window.keplr.defaultOptions = {
        sign: {
          preferNoSetFee: __KEPLR_PREFER_NO_SET_FEE__,
        },
      }
    }
  }, [__KEPLR_PREFER_NO_SET_FEE__])

  /* apply theme class on body also */
  useEffect(() => {
    document.body.classList.add(themeClassName)
    applyGlobalStyles()
    return () => {
      document.body.classList.remove(themeClassName)
    }
  }, [themeClassName])

  return (
    <StyledContentWrapper
      data-app-wrapper=""
      lang="en-US"
      className={isRenderingOnServerSide ? null : themeClassName}
      suppressHydrationWarning={true}
    >
      {isRenderingOnServerSide ? null : children}
    </StyledContentWrapper>
  )
}

const StyledContentWrapper = styled('div', {
  backgroundColor: '$backgroundColors$base',
})
