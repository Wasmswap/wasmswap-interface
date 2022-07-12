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
import { ReactNode, useRef } from 'react'

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
    /* passing ibc amino types to make the ibc messages work on amino signers (eg ledger, wallet connect) */
    aminoTypes: new AminoTypes(createIbcAminoConverters()),
  })).current

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
