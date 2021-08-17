import React, { createContext, useContext, useState } from 'react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { connectKeplr } from 'services/keplr'
import { chainInfo } from 'public/chain_info'

interface AppContextType {
  address: string
  client: any
  connectWallet: () => void
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export const useAppContext = (): AppContextType => useContext(AppContext)

export function AppProvider({
  children,
}: React.HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [address, setAddress] = useState('')
  const [client, setClient] = useState({})

  const connectWallet = async () => {
    await window.keplr?.experimentalSuggestChain(chainInfo)
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
    await window.keplr?.enable(chainId)
    const offlineSigner = await window?.getOfflineSigner(chainId)

    const wasmChainClient = await SigningCosmWasmClient.connectWithSigner(
      process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT,
      offlineSigner
    )

    setClient(wasmChainClient)

    const [{ address }] = await offlineSigner.getAccounts()

    setAddress(address)
  }

  const value: AppContextType = { address, client, connectWallet }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
