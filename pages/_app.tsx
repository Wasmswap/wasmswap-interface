import 'normalize.css'
import 'styles/globals.scss'
import 'focus-visible'

import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { TestnetDialog } from 'components/TestnetDialog'
import { queryClient } from 'services/queryClient'
import { __TEST_MODE__ } from '../util/constants'
import { useThemeClassName } from '../components/theme'

function NextJsAppRoot({ children }) {
  const themeClassName = useThemeClassName()

  return (
    <div
      data-app-wrapper=""
      lang="en-US"
      className={themeClassName}
      suppressHydrationWarning
    >
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NextJsAppRoot>
          <ErrorBoundary>
            <Component {...pageProps} />
            {__TEST_MODE__ && <TestnetDialog />}
            <Toaster
              position="top-right"
              toastOptions={{ duration: 15000000 }}
            />
          </ErrorBoundary>
        </NextJsAppRoot>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
