import 'styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { RecoilRoot } from 'recoil'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { AppBackground } from '../components/AppBackground'

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
      <SafeHydrate>
        <AppBackground>
          <ErrorBoundary>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ErrorBoundary>
        </AppBackground>
      </SafeHydrate>
    </RecoilRoot>
  )
}

export default MyApp
