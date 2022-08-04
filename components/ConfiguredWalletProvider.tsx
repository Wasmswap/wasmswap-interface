import { createWasmAminoConverters } from '@cosmjs/cosmwasm-stargate'
import {
  AminoTypes,
  createIbcAminoConverters,
  GasPrice,
} from '@cosmjs/stargate'
import {
  ChainInfoID,
  WalletManagerProvider,
  WalletType,
} from '@noahsaso/cosmodal'
import { globalCss } from 'junoblocks'
import { ReactNode, useEffect, useRef } from 'react'

import { useIsRenderingOnServer } from '../hooks/useIsRenderingOnServer'
import { APP_DESCRIPTION, APP_NAME, GAS_PRICE } from '../util/constants'

type ConfiguredWalletProviderProps = {
  children: ReactNode
}

export const ConfiguredWalletProvider = ({
  children,
}: ConfiguredWalletProviderProps) => {
  const isRenderingOnServer = useIsRenderingOnServer()
  const getSigningClientOptions = useRef(() => ({
    gasPrice: GasPrice.fromString(GAS_PRICE),
    /*
     * passing ibc amino types for all the amino signers (eg ledger, wallet connect)
     * to enable ibc & wasm transactions
     * */
    aminoTypes: new AminoTypes(
      Object.assign(createIbcAminoConverters(), createWasmAminoConverters())
    ),
  })).current

  useEffect(() => {
    applyWalletDialogStyles()
  }, [])

  return (
    <WalletManagerProvider
      defaultChainId={ChainInfoID.Juno1}
      enabledWalletTypes={[WalletType.Keplr, WalletType.WalletConnectKeplr]}
      localStorageKey="@wasmswap/wallet-state"
      walletConnectClientMeta={{
        name: APP_NAME,
        description: APP_DESCRIPTION,
        url: isRenderingOnServer ? '' : window.origin,
        icons: ['https://cosmodal.example.app/walletconnect.png'],
      }}
      getSigningCosmWasmClientOptions={getSigningClientOptions}
      getSigningStargateClientOptions={getSigningClientOptions}
    >
      {children}
    </WalletManagerProvider>
  )
}

const applyWalletDialogStyles = globalCss({
  'body .ReactModal__Overlay': {
    backgroundColor: '$colors$light75',
  },
})
