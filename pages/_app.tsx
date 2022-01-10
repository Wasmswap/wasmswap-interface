import 'normalize.css'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/globals.scss'
import 'focus-visible'

import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Portal } from '@reach/portal'
import { ToastContainer } from 'react-toastify'
import { TestnetDialog } from '../components/TestnetDialog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
})

function SafeHydrate({ children }) {
  return (
    <div data-app-wrapper="" lang="en-US" suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SafeHydrate>
          <ErrorBoundary>
            <Component {...pageProps} />
            <TestnetDialog />
            <Portal>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                toastStyle={{ zIndex: 150 }}
                style={{ width: 'auto' }}
              />
            </Portal>
          </ErrorBoundary>
        </SafeHydrate>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
