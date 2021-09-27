import { Text } from '../Text'
import styled from 'styled-components'
import { PoolCard } from './PoolCard'
import { useState } from 'react'
import { PoolDialog } from '../PoolDialog'

export const PoolsContent = () => {
  const [isDialogShowing, setIsDialogShowing] = useState(false)

  const openDialog = () => setIsDialogShowing(true)

  return (
    <>
      <StyledTitle type="heading" variant="bold">
        Pools
      </StyledTitle>
      <StyledSubtitle type="body" variant="light">
        Some helpful explainer text tells you what a liquidity pool is and what
        you’re risking. Right now, wasmswap users have a total of $23,028,048 in
        liquidity pools.
      </StyledSubtitle>

      <StyledDivForPoolsGrid>
        {new Array(3)
          .fill(
            <PoolCard
              tokenAName="Juno"
              tokenBName="Pood"
              availableLiquidity={1000000}
              liquidity={0}
              onButtonClick={openDialog}
            />
          )
          .map((renderedItem, index) => ({ ...renderedItem, key: index }))}
      </StyledDivForPoolsGrid>
      <PoolDialog
        isShowing={isDialogShowing}
        onRequestClose={() => setIsDialogShowing(false)}
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