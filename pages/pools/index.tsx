import React, { useState } from 'react'
import styled from 'styled-components'
import { AppLayout } from '../../components/Layout/AppLayout'
import TokenList from '../../public/token_list.json'
import { PoolCard } from '../../components/Pools/PoolCard'
import { PoolDialog } from '../../components/Pools/PoolDialog'
import { TokenInfo } from '../../hooks/useTokenInfo'
import { Text } from '../../components/Text'

export default function Pools() {
  const [isDialogShowing, setIsDialogShowing] = useState(false)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()

  const openDialog = (tokenInfo) => {
    setTokenInfo(tokenInfo)
    setIsDialogShowing(true)
  }

  return (
    <AppLayout>
      <StyledTitle type="title" variant="bold">
        Pools
      </StyledTitle>
      <StyledSubtitle type="body" variant="light">
        Provide liquidity to the market by adding assets to the pools and
        receive swap fees from each trade.
      </StyledSubtitle>

      <StyledDivForPoolsGrid>
        {TokenList.tokens
          .filter((x) => x.token_address)
          .map((token, key) => (
            <PoolCard
              key={key}
              tokenASymbol="JUNO"
              tokenBSymbol={token.symbol}
              onClick={() => openDialog(token)}
            />
          ))}
      </StyledDivForPoolsGrid>
      <PoolDialog
        isShowing={isDialogShowing}
        onRequestClose={() => setIsDialogShowing(false)}
        tokenInfo={tokenInfo || {}}
      />
    </AppLayout>
  )
}

const StyledTitle = styled(Text)`
  padding: 32px 0 18px;
`

const StyledSubtitle = styled(Text)`
  padding-bottom: 29px;
`

const StyledDivForPoolsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  column-gap: 20px;
  row-gap: 24px;
  padding-bottom: 24px;
`
