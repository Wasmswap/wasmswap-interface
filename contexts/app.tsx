import React, { createContext, useContext } from 'react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { chainInfo } from 'public/chain_info'
import { useRecoilState } from 'recoil'
import { clientState, walletAddressState } from '../state/atoms/walletAtoms'

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
  const [address, setAddress] = useRecoilState(walletAddressState)
  const [client, setClient] = useRecoilState(clientState)

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
