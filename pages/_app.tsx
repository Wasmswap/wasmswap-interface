import 'normalize.css'
import 'styles/globals.scss'
import 'focus-visible'

import { ErrorBoundary } from 'components/ErrorBoundary'
import { TestnetDialog } from 'components/TestnetDialog'
import { css, media, useMedia } from 'junoblocks'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { queryClient } from 'services/queryClient'

import { ConfiguredWalletProvider } from '../components/ConfiguredWalletProvider'
import { NextJsAppRoot } from '../components/NextJsAppRoot'
import { __TEST_MODE__ } from '../util/constants'

const toasterClassName = css({
  [media.sm]: {
    width: '100%',
    padding: 0,
    bottom: '$6 !important',
  },
}).toString()

function MyApp({ Component, pageProps }: AppProps) {
  const isSmallScreen = useMedia('sm')
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <NextJsAppRoot>
          <ErrorBoundary>
            <ConfiguredWalletProvider>
              <Component {...pageProps} />
              {__TEST_MODE__ && <TestnetDialog />}
              <Toaster
                position={isSmallScreen ? 'bottom-center' : 'top-right'}
                toastOptions={{ duration: 10000 }}
                containerClassName={toasterClassName}
                containerStyle={isSmallScreen ? { inset: 0 } : undefined}
              />
            </ConfiguredWalletProvider>
          </ErrorBoundary>
        </NextJsAppRoot>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
