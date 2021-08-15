import React, { useState } from 'react'
import { useAppContext } from 'contexts/app'
import Nav from './Nav'

export default function Layout({ children }) {
  const { address, connectWallet } = useAppContext()

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
