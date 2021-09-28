import 'styles/globals.css'
import 'normalize.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
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
