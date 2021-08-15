import type { AppProps } from 'next/app'
import { AppProvider } from 'contexts/app'
import Layout from 'components/Layout'

import 'tailwindcss/tailwind.css'
import 'styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}
export default MyApp
