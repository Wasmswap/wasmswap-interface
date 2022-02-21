import { useMemo } from 'react'
import { ChainInfo } from '@keplr-wallet/types'
import { DEFAULT_GAS_FEE_FOR_SWAP } from 'util/constants'
import { useChainInfo } from './useChainInfo'
import { useTokenInfo } from './useTokenInfo'

type UseTokenGasPriceArgs = {
  tokenSymbol: string
  keyForFee?: keyof ChainInfo['gasPriceStep']
}

export const useTokenGasPrice = ({
  tokenSymbol,
  keyForFee = 'low',
}: UseTokenGasPriceArgs) => {
  const tokenInfo = useTokenInfo(tokenSymbol)

  const { data } = useChainInfo()
  const { base_chain, external_chains } = data || {}

  return useMemo(() => {
    const chainInfo =
      external_chains?.find((chain) => chain.chainId === tokenInfo.chain_id) ||
      base_chain

    return chainInfo?.gasPriceStep?.[keyForFee] || DEFAULT_GAS_FEE_FOR_SWAP
  }, [tokenInfo, base_chain, external_chains, keyForFee])
}
