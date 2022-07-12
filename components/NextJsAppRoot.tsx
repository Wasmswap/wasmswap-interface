import {
  globalCss,
  styled,
  useSubscribeDefaultAppTheme,
  useThemeClassName,
} from 'junoblocks'
import { useEffect } from 'react'

import { useIsRenderingOnServer } from '../hooks/useIsRenderingOnServer'

const applyGlobalStyles = globalCss({
  body: {
    backgroundColor: '$backgroundColors$base',
  },
})

export function NextJsAppRoot({ children }) {
  const isRenderingOnServer = useIsRenderingOnServer()

  const themeClassName = useThemeClassName()
  useSubscribeDefaultAppTheme()

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
      className={isRenderingOnServer ? null : themeClassName}
      suppressHydrationWarning={true}
    >
      {isRenderingOnServer ? null : children}
    </StyledContentWrapper>
  )
}

const StyledContentWrapper = styled('div', {
  backgroundColor: '$backgroundColors$base',
})
