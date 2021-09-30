import { Text } from '../Text'
import styled from 'styled-components'
import { PoolCard } from './PoolCard'
import { useState } from 'react'
import { PoolDialog } from '../PoolDialog'
import TokenList from '../../public/token_list.json'
import { formatTokenName } from 'util/conversion'
import { TokenInfo } from '../../hooks/useTokenInfo'

export const PoolsContent = () => {
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()

  const openDialog = (tokenInfo) => {
    setTokenInfo(tokenInfo)
    setIsDialogShowing(true)
  }

  return (
    <>
      <StyledTitle type="title" variant="bold">
        Pools
      </StyledTitle>
      <StyledSubtitle type="body" variant="light">
        Add assets and earn swap fees for providing liquidity to the market.
      </StyledSubtitle>

      <StyledDivForPoolsGrid>
        {TokenList.tokens
          .filter((x) => x.token_address)
          .map((token, key) => (
            <PoolCard
              key={key}
              tokenAName="Juno"
              tokenBName={formatTokenName(token.symbol)}
              tokenInfo={token}
              onButtonClick={() => openDialog(token)}
            />
          ))}
      </StyledDivForPoolsGrid>
      <PoolDialog
        isShowing={isDialogShowing}
        onRequestClose={() => setIsDialogShowing(false)}
        tokenInfo={tokenInfo || {}}
      />
    </>
  )
}

const StyledTitle = styled(Text)`
  padding: 32px 0 8px;
`

const StyledSubtitle = styled(Text)`
  padding-bottom: 16px;
`

const StyledDivForPoolsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 21px;
  row-gap: 14px;
  padding-bottom: 30px;
`
