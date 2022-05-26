import { useQuery } from 'react-query'

import { cosmWasmClientRouter } from '../util/cosmWasmClientRouter'
import { useChainInfo } from './useChainInfo'

export const useCosmWasmClient = () => {
  const [chainInfo] = useChainInfo()

  const { data } = useQuery(
    '@cosmwasm-client',
    () => cosmWasmClientRouter.connect(chainInfo.rpc),
    { enabled: Boolean(chainInfo?.rpc) }
  )

  return data
}
