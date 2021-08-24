import React from 'react'
import { useConnectWallet } from '../hooks/useConnectWallet'
import Nav from './Nav'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'

export default function Layout({ children }) {
  const connectWallet = useConnectWallet()
  const { address } = useRecoilValue(walletState)

  return (
    <>
      <Nav
        title={process.env.NEXT_PUBLIC_SITE_TITLE}
        logoURL={process.env.NEXT_PUBLIC_LOGO_URL}
        walletAddress={address}
        onConnectWallet={connectWallet}
      />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  )
}
