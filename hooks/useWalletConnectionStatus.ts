import { useRecoilValue } from 'recoil'

import {
  ibcWalletState,
  walletState,
  WalletStatusType,
} from '../state/atoms/walletAtoms'

export const useWalletConnectionStatus = (
  wallet: typeof walletState | typeof ibcWalletState
) => {
  const { status: walletStatus } = useRecoilValue(wallet as typeof walletState)
  const isConnected = walletStatus === WalletStatusType.connected
  const isConnecting =
    walletStatus === WalletStatusType.connecting ||
    walletStatus === WalletStatusType.restored

  return {
    isConnecting,
    isConnected,
  }
}
