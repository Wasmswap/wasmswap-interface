import type { AppProps } from 'next/app'
import Layout from 'components/Layout'

import 'tailwindcss/tailwind.css'
import 'styles/globals.css'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from '../components/ErrorBoundary'

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
      <Layout>
        <SafeHydrate>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </SafeHydrate>
      </Layout>
    </RecoilRoot>
  )
}

export default MyApp
