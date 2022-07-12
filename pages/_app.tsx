import 'normalize.css'
import 'styles/globals.scss'
import 'focus-visible'

import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from '@noahsaso/cosmodal'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { TestnetDialog } from 'components/TestnetDialog'
import { css, media, useMedia } from 'junoblocks'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import { queryClient } from 'services/queryClient'
import { NextJsAppRoot } from '../components/NextJsAppRoot'

import { __TEST_MODE__, APP_DESCRIPTION, APP_NAME } from '../util/constants'

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
    <WalletManagerProvider
      defaultChainId={ChainInfoID.Juno1}
      enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
      localStorageKey="@wasmswap/wallet-state"
      walletConnectClientMeta={{
        name: APP_NAME,
        description: APP_DESCRIPTION,
        url: typeof window !== 'undefined' ? window.origin : '',
        icons: ['https://cosmodal.example.app/walletconnect.png'],
      }}
    >
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
      </WalletManagerProvider>
  )
}

export default MyApp
