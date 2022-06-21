import 'normalize.css'
import 'styles/globals.scss'
import 'focus-visible'

import { ErrorBoundary } from 'components/ErrorBoundary'
import { TestnetDialog } from 'components/TestnetDialog'
import {
  css,
  globalCss,
  media,
  styled,
  useMedia,
  useSubscribeDefaultAppTheme,
  useThemeClassName,
} from 'junoblocks'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { queryClient } from 'services/queryClient'

import { __TEST_MODE__ } from '../util/constants'

const applyGlobalStyles = globalCss({
  body: {
    backgroundColor: '$backgroundColors$base',
  },
})

const toasterClassName = css({
  [media.sm]: {
    width: '100%',
    padding: 0,
    bottom: '$6 !important',
  },
}).toString()

function NextJsAppRoot({ children }) {
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
      className={typeof window === 'undefined' ? null : themeClassName}
      suppressHydrationWarning
    >
      {typeof window === 'undefined' ? null : children}
    </StyledContentWrapper>
  )
}

const StyledContentWrapper = styled('div', {
  backgroundColor: '$backgroundColors$base',
})

function MyApp({ Component, pageProps }: AppProps) {
  const isSmallScreen = useMedia('sm')
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NextJsAppRoot>
          <ErrorBoundary>
            <Component {...pageProps} />
            {__TEST_MODE__ && <TestnetDialog />}
            <Toaster
              position={isSmallScreen ? 'bottom-center' : 'top-right'}
              toastOptions={{ duration: 1000000 }}
              containerClassName={toasterClassName}
              containerStyle={isSmallScreen ? { inset: 0 } : undefined}
            />
          </ErrorBoundary>
        </NextJsAppRoot>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
