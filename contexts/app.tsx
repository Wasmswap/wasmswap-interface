import React, { createContext, useContext, useState } from 'react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { connectKeplr } from 'services/keplr'
import { chainInfo } from 'public/chain_info'

interface AppContextType {
  address: string
  client: SigningCosmWasmClient | undefined
  connectWallet: () => void
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export const useAppContext = (): AppContextType => useContext(AppContext)

export function AppProvider({
  children,
}: React.HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const [address, setAddress] = useState('')
  const [client, setClient] = useState<SigningCosmWasmClient | undefined>(undefined)

  const connectWallet = async () => {
    await (window as any).keplr?.experimentalSuggestChain(chainInfo)
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
    await (window as any).keplr?.enable(chainId)
    const offlineSigner = await (window as any).getOfflineSigner(chainId)

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
