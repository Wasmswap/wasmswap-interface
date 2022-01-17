import { useTokenList } from 'hooks/useTokenList'
import { TokenSelectList } from '../../../components/TokenSelectList'

export const TokenOptionsList = ({ activeTokenSymbol, onSelect, ...props }) => {
  const [tokenList] = useTokenList()
  return (
    <TokenSelectList
      {...props}
      tokenList={tokenList.tokens}
      activeTokenSymbol={activeTokenSymbol}
      onSelect={onSelect}
      fetchingBalanceMode="native"
    />
  )
}
