import { TokenSelectList } from 'components'
import { useIBCAssetList } from 'hooks/useIbcAssetList'

export const TokenOptionsList = ({
  activeTokenSymbol,
  onSelect,
  fetchingBalanceMode,
  ...props
}) => {
  const [tokenList] = useIBCAssetList()
  return (
    <TokenSelectList
      {...props}
      tokenList={tokenList.tokens}
      activeTokenSymbol={activeTokenSymbol}
      onSelect={onSelect}
      visibleNumberOfTokensInViewport={2.5}
      fetchingBalanceMode={fetchingBalanceMode}
    />
  )
}
