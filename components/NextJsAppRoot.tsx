import {
  globalCss,
  styled,
  useSubscribeDefaultAppTheme,
  useThemeClassName,
} from 'junoblocks'
import { useEffect, useState } from 'react'

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
