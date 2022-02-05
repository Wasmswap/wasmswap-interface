import { useEffect, useRef, useState } from 'react'
import { PlusIcon } from '@heroicons/react/solid'
import { styled } from 'components/theme'
import { Text } from 'components/Text'
import { LiquidityInput } from 'components/LiquidityInput'
import { IconWrapper } from 'components/IconWrapper'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  protectAgainstNaN,
} from 'util/conversion'
import { useBaseTokenInfo, useTokenInfoByPoolId } from 'hooks/useTokenInfo'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import { usePoolDialogController } from './usePoolDialogController'
import { TokenToTokenRates } from './TokenToTokenRates'
import { StateSwitchButtons } from '../StateSwitchButtons'
import { LiquidityInputSelector } from '../LiquidityInputSelector'
import { PercentageSelection } from '../PercentageSelection'
import { Button } from 'components/Button'
import {
  DialogHeader,
  DialogContent,
  Dialog,
  DialogDivider,
  DialogButtons,
} from 'components/Dialog'
import { Spinner } from 'components/Spinner'
import { usePrevious } from '@reach/utils'

type ManagePoolDialogProps = {
  isShowing: boolean
  initialActionType: 'add' | 'remove'
  onRequestClose: () => void
  poolId: string
}

export const ManagePoolDialog = ({
  isShowing,
  initialActionType,
  onRequestClose,
  poolId,
}: ManagePoolDialogProps) => {
  const tokenInfo = useTokenInfoByPoolId(poolId)

  const [isAddingLiquidity, setAddingLiquidity] = useState(
    initialActionType !== 'remove'
  )

  const [addLiquidityPercent, setAddLiquidityPercent] = useState(0)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const tokenA = useBaseTokenInfo()

  const {
    state: {
      tokenAReserve,
      tokenBReserve,
      tokenABalance,
      tokenBBalance,
      maxApplicableBalanceForTokenA,
      maxApplicableBalanceForTokenB,
      isLoading,
    },
    actions: { mutateAddLiquidity },
  } = usePoolDialogController({
    actionState: isAddingLiquidity ? 'add' : 'remove',
    tokenInfo,
    percentage: isAddingLiquidity
      ? addLiquidityPercent
      : removeLiquidityPercent,
  })

  const canManageLiquidity = tokenAReserve > 0

  const handleSubmit = () =>
    mutateAddLiquidity(null, {
      onSuccess() {
        requestAnimationFrame(onRequestClose)
        setRemoveLiquidityPercent(0)
        setAddLiquidityPercent(0)
      },
    })

  useEffect(() => {
    if (!canManageLiquidity) {
      setAddingLiquidity((isAdding) => {
        return !isAdding ? true : isAdding
      })
    }
  }, [canManageLiquidity])

  /* update initial tab whenever dialog opens */
  const previousIsShowing = usePrevious(isShowing)
  useEffect(() => {
    const shouldUpdateInitialState =
      previousIsShowing !== isShowing && isShowing
    if (shouldUpdateInitialState) {
      setAddingLiquidity(initialActionType !== 'remove')
    }
  }, [initialActionType, previousIsShowing, isShowing])

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose}>
      <DialogHeader paddingBottom={canManageLiquidity ? '$8' : '$12'}>
        <Text variant="header">Manage liquidity</Text>
      </DialogHeader>

      {canManageLiquidity && (
        <>
          <DialogContent>
            <StateSwitchButtons
              activeValue={isAddingLiquidity ? 'add' : 'remove'}
              values={['add', 'remove']}
              onStateChange={(value) => {
                setAddingLiquidity(value === 'add')
              }}
            />
          </DialogContent>
          <DialogDivider offsetY="$8" />
        </>
      )}

      <DialogContent>
        <Text variant="body" css={{ paddingBottom: '$6' }}>
          Choose how much to {isAddingLiquidity ? 'add' : 'remove'}
        </Text>
      </DialogContent>

      {isAddingLiquidity && (
        <AddLiquidityContent
          isLoading={isLoading}
          tokenASymbol={tokenA.symbol}
          tokenBSymbol={tokenInfo?.symbol}
          tokenABalance={tokenABalance}
          tokenBBalance={tokenBBalance}
          maxApplicableBalanceForTokenA={maxApplicableBalanceForTokenA}
          maxApplicableBalanceForTokenB={maxApplicableBalanceForTokenB}
          liquidityPercentage={addLiquidityPercent}
          onChangeLiquidity={setAddLiquidityPercent}
        />
      )}

      {!isAddingLiquidity && (
        <RemoveLiquidityContent
          tokenA={tokenA}
          tokenB={tokenInfo}
          tokenAReserve={tokenAReserve}
          tokenBReserve={tokenBReserve}
          liquidityPercentage={removeLiquidityPercent}
          onChangeLiquidity={setRemoveLiquidityPercent}
        />
      )}

      <DialogDivider offsetTop="$16" offsetBottom="$8" />

      <DialogButtons>
        <Button variant="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={isLoading ? undefined : handleSubmit}
        >
          {isLoading ? (
            <Spinner instant={true} size={16} />
          ) : (
            <>{isAddingLiquidity ? 'Add' : 'Remove'} liquidity</>
          )}
        </Button>
      </DialogButtons>
    </Dialog>
  )
}

function AddLiquidityContent({
  liquidityPercentage,
  tokenASymbol,
  tokenBSymbol,
  tokenABalance,
  tokenBBalance,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  isLoading,
  onChangeLiquidity,
}) {
  const handleTokenAAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenA)

    onChangeLiquidity(protectAgainstNaN(value / maxApplicableBalanceForTokenA))
  }

  const handleTokenBAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenB)

    onChangeLiquidity(protectAgainstNaN(value / maxApplicableBalanceForTokenB))
  }

  const handleApplyMaximumAmount = () => {
    handleTokenAAmountChange(maxApplicableBalanceForTokenA)
  }

  const tokenAAmount = maxApplicableBalanceForTokenA * liquidityPercentage
  const tokenBAmount = maxApplicableBalanceForTokenB * liquidityPercentage

  return (
    <DialogContent>
      <StyledDivForLiquidityInputs>
        <LiquidityInput
          tokenSymbol={tokenASymbol}
          availableAmount={tokenABalance ? tokenABalance : 0}
          maxApplicableAmount={maxApplicableBalanceForTokenA}
          amount={tokenAAmount}
          onAmountChange={handleTokenAAmountChange}
        />
        <LiquidityInput
          tokenSymbol={tokenBSymbol}
          availableAmount={tokenBBalance ? tokenBBalance : 0}
          maxApplicableAmount={maxApplicableBalanceForTokenB}
          amount={tokenBAmount}
          onAmountChange={handleTokenBAmountChange}
        />
      </StyledDivForLiquidityInputs>
      <StyledDivForTxRates>
        <TokenToTokenRates
          tokenASymbol={tokenASymbol}
          tokenBSymbol={tokenBSymbol}
          tokenAAmount={tokenAAmount}
          isLoading={isLoading}
        />
      </StyledDivForTxRates>
      <Button
        variant="secondary"
        onClick={handleApplyMaximumAmount}
        iconLeft={<IconWrapper icon={<PlusIcon />} />}
      >
        Provide max liquidity
      </Button>
    </DialogContent>
  )
}

function RemoveLiquidityContent({
  tokenA,
  tokenB,
  tokenAReserve,
  tokenBReserve,
  liquidityPercentage,
  onChangeLiquidity,
}) {
  const [tokenAPrice] = useTokenDollarValue(tokenA.symbol)
  const percentageInputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    percentageInputRef.current?.focus()
  }, [])

  const availableLiquidityDollarValue = dollarValueFormatter(
    tokenAReserve * 2 * tokenAPrice
  ) as number

  const liquidityToRemove = availableLiquidityDollarValue * liquidityPercentage

  const handleChangeLiquidity = (value) => {
    onChangeLiquidity(value / availableLiquidityDollarValue)
  }

  return (
    <>
      <DialogContent>
        <LiquidityInputSelector
          inputRef={percentageInputRef}
          maxLiquidity={availableLiquidityDollarValue}
          liquidity={liquidityToRemove}
          onChangeLiquidity={handleChangeLiquidity}
        />
        <StyledGridForDollarValueTxInfo>
          <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
            Available liquidity: $
            {dollarValueFormatterWithDecimals(availableLiquidityDollarValue, {
              includeCommaSeparation: true,
            })}
          </Text>
          <Text variant="caption" color="tertiary" css={{ padding: '$6 0 $9' }}>
            ≈ ${' '}
            {dollarValueFormatterWithDecimals(liquidityToRemove, {
              includeCommaSeparation: true,
            })}
          </Text>
        </StyledGridForDollarValueTxInfo>
        <PercentageSelection
          maxLiquidity={availableLiquidityDollarValue}
          liquidity={liquidityToRemove}
          onChangeLiquidity={handleChangeLiquidity}
        />
      </DialogContent>
      <DialogDivider offsetY="$8" />
      <DialogContent>
        <Text variant="body" css={{ paddingBottom: '$7' }}>
          Removing
        </Text>
        <StyledDivForLiquiditySummary>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenA.logoURI} alt={tokenA.name} />
            <Text variant="caption">
              {formatTokenBalance(tokenAReserve * liquidityPercentage)}{' '}
              {tokenA.symbol}
            </Text>
          </StyledDivForToken>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenB.logoURI} alt={tokenB.name} />
            <Text variant="caption">
              {formatTokenBalance(tokenBReserve * liquidityPercentage)}{' '}
              {tokenB.symbol}
            </Text>
          </StyledDivForToken>
        </StyledDivForLiquiditySummary>
      </DialogContent>
    </>
  )
}

const StyledDivForTxRates = styled('div', {
  padding: '$7 0 $12',
})

const StyledDivForLiquidityInputs = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: 8,
})

const StyledGridForDollarValueTxInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const StyledDivForLiquiditySummary = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$12',
})

const StyledDivForToken = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: '$space$4',
})

const StyledImageForTokenLogo = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
})
