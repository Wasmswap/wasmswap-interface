import 'styles/globals.css'
import 'normalize.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
})

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ErrorBoundary>
        </SafeHydrate>
      </QueryClientProvider>
    </RecoilRoot>
  )
}

export default MyApp
