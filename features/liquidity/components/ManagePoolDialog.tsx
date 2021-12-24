import styled from 'styled-components'
import { PlusIcon } from '@heroicons/react/solid'
import { Dialog, DialogBody } from 'components/Dialog'
import { Text } from 'components/Text'
import { LiquidityInput } from 'components/LiquidityInput'
import { Link } from 'components/Link'
import { Button } from 'components/Button'
import { formatTokenName } from 'util/conversion'
import { Spinner } from 'components/Spinner'
import { colorTokens } from 'util/constants'
import { RemoveLiquidityInput } from 'components/RemoveLiquidityInput'
import { usePoolDialogController } from '../hooks/usePoolDialogController'
import { useState } from 'react'
import { TokenInfo } from '../../../hooks/useTokenInfo'

type ManagePoolDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  tokenInfo: TokenInfo
}

const balanceFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

export const ManagePoolDialog = ({
  isShowing,
  onRequestClose,
  tokenInfo,
}: ManagePoolDialogProps) => {
  const [isAddingLiquidity, setAddingLiquidity] = useState(true)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const {
    state: {
      tokenAReserve,
      tokenBReserve,
      tokenASymbol,
      tokenABalance,
      tokenAAmount,
      tokenBAmount,
      tokenBBalance,
      isLoading,
    },
    actions: {
      mutateAddLiquidity,
      handleTokenBAmountChange,
      handleTokenAAmountChange,
      handleApplyMaximumAmount,
    },
  } = usePoolDialogController({
    actionState: isAddingLiquidity ? 'add' : 'remove',
    removeLiquidityPercent,
    tokenInfo,
  })

  const handleSubmit = () =>
    mutateAddLiquidity(null, {
      onSuccess() {
        // close modal
        requestAnimationFrame(onRequestClose)
      },
    })

  const submitButtonText = isAddingLiquidity
    ? 'Add Liquidity'
    : 'Remove Liquidity'

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogBody>
        {tokenAReserve > 0 && (
          <StyledDivForButtons>
            <StyledSwitchButton
              onClick={() => setAddingLiquidity(true)}
              $active={isAddingLiquidity}
            >
              Add
            </StyledSwitchButton>
            <StyledSwitchButton
              onClick={() => setAddingLiquidity(false)}
              $active={!isAddingLiquidity}
            >
              Remove
            </StyledSwitchButton>
          </StyledDivForButtons>
        )}

        <StyledTitle
          $hasSubtitle={!isAddingLiquidity}
          type="title"
          variant="normal"
        >
          {isAddingLiquidity ? 'Add' : 'Remove'}{' '}
          {`${formatTokenName(tokenASymbol)} / ${formatTokenName(
            tokenInfo.symbol
          )}`}
        </StyledTitle>

        {!isAddingLiquidity && (
          <StyledSubtitle variant="light">
            Choose a percentage of your liquidity to remove
          </StyledSubtitle>
        )}

        {isAddingLiquidity && (
          <>
            <LiquidityInput
              tokenName={formatTokenName(tokenASymbol)}
              balance={tokenABalance ? tokenABalance : 0}
              amount={tokenAAmount}
              ratio={50}
              onAmountChange={handleTokenAAmountChange}
            />
            <LiquidityInput
              tokenName={formatTokenName(tokenInfo.symbol)}
              balance={tokenBBalance ? tokenBBalance : 0}
              amount={tokenBAmount}
              ratio={50}
              onAmountChange={handleTokenBAmountChange}
            />
          </>
        )}

        {!isAddingLiquidity && (
          <RemoveLiquidityInput
            value={removeLiquidityPercent}
            onChangeValue={setRemoveLiquidityPercent}
          />
        )}

        {isAddingLiquidity && (
          <StyledDivForLink>
            <StyledPlusIcon />
            <Link
              color="black"
              variant="normal"
              type="body"
              onClick={handleApplyMaximumAmount}
            >
              Add maximum amounts
            </Link>
          </StyledDivForLink>
        )}

        {!isAddingLiquidity && (
          <StyledDivForLiquiditySummary>
            <Text>
              {tokenASymbol}:{' '}
              {balanceFormatter.format(
                tokenAReserve * (removeLiquidityPercent / 100)
              )}
            </Text>
            <Text>
              {tokenInfo.symbol}:{' '}
              {balanceFormatter.format(
                tokenBReserve * (removeLiquidityPercent / 100)
              )}
            </Text>
          </StyledDivForLiquiditySummary>
        )}

        <StyledButton
          size="humongous"
          onClick={isLoading ? undefined : handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner instant /> : submitButtonText}
        </StyledButton>
      </DialogBody>
    </Dialog>
  )
}

const StyledTitle = styled(Text)<{ $hasSubtitle: boolean }>`
  padding: ${(p) => (p.$hasSubtitle ? '18px 14px 8px' : '18px 14px')};
`

const StyledSubtitle = styled(Text)`
  padding: 0 14px 42px;
`

const StyledButton = styled(Button)`
  margin: 8px 0 14px;
`

const StyledPlusIcon = styled(PlusIcon)`
  color: ${colorTokens.black};
  width: 24px;
  height: 24px;
  margin-right: 8px;
`

const StyledDivForLink = styled.div`
  padding: 24px 14px;
  display: flex;
  align-items: center;
`

const StyledDivForButtons = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`

const StyledSwitchButton = styled(Button).attrs(
  ({ $active, children, ...attrs }) => ({
    ...attrs,
    variant: 'rounded',
    color: $active ? 'black' : 'white',
    children: (
      <Text color={$active ? 'white' : 'black'} type="subtitle" variant="light">
        {children}
      </Text>
    ),
  })
)`
  min-width: 88px;
  margin-right: 4px;
`

const StyledDivForLiquiditySummary = styled.div`
  padding: 12px 14px 16px;
  text-transform: uppercase;
  p + p {
    padding-top: 12px;
  }
`
