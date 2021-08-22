import type { AppProps } from 'next/app'
import { AppProvider } from 'contexts/app'
import Layout from 'components/Layout'

import 'tailwindcss/tailwind.css'
import 'styles/globals.css'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AppProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppProvider>
    </RecoilRoot>
  )
}
export default MyApp
