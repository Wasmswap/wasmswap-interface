import { styled } from '@stitches/react'
import { PlusIcon } from '@heroicons/react/solid'
import { Dialog, StyledCloseIcon } from 'components/Dialog'
import { Text } from 'components/Text'
import { LiquidityInput } from 'components/LiquidityInput'
import {
  dollarValueFormatter,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  protectAgainstNaN,
} from 'util/conversion'
import { usePoolDialogController } from './usePoolDialogController'
import { useEffect, useRef, useState } from 'react'
import {
  getBaseToken,
  useTokenInfoByPoolId,
} from '../../../../hooks/useTokenInfo'
import { TokenToTokenRates } from './TokenToTokenRates'
import { SecondaryButton } from '../SecondaryButton'
import { PrimaryButton } from '../PrimaryButton'
import { Divider } from '../Divider'
import { StateSwitchButtons } from '../StateSwitchButtons'
import { LiquidityInputSelector } from '../LiquidityInputSelector'
import { PercentageSelection } from '../PercentageSelection'
import { useTokenDollarValue } from '../../../../hooks/useTokenDollarValue'

type ManagePoolDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  poolId: string
}

export const ManagePoolDialog = ({
  isShowing,
  onRequestClose,
  poolId,
}: ManagePoolDialogProps) => {
  const tokenInfo = useTokenInfoByPoolId(poolId)

  const [isAddingLiquidity, setAddingLiquidity] = useState(true)

  const [addLiquidityPercent, setAddLiquidityPercent] = useState(0)
  const [removeLiquidityPercent, setRemoveLiquidityPercent] = useState(0)

  const tokenA = getBaseToken()

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

  return (
    <Dialog isShowing={isShowing} onRequestClose={onRequestClose} kind="blank">
      <StyledCloseIcon onClick={onRequestClose} offset={19} size="16px" />

      <StyledDivForContent>
        <Text
          type="heading"
          variant="bold"
          paddingBottom={canManageLiquidity ? '16px' : '24px'}
        >
          Manage liquidity
        </Text>
      </StyledDivForContent>

      {canManageLiquidity && (
        <>
          <StyledDivForContent>
            <StateSwitchButtons
              activeValue={isAddingLiquidity ? 'add' : 'remove'}
              values={['add', 'remove']}
              onStateChange={(value) => {
                setAddingLiquidity(value === 'add')
              }}
            />
          </StyledDivForContent>
          <Divider offsetY={16} />
        </>
      )}

      <StyledDivForContent>
        <Text type="caption" paddingBottom="12px">
          Choose how much to {isAddingLiquidity ? 'add' : 'remove'}
        </Text>
      </StyledDivForContent>

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

      <StyledDivForDivider>
        <Divider />
      </StyledDivForDivider>
      <StyledDivForContent>
        <StyledDivForFooter>
          <SecondaryButton onClick={onRequestClose}>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={isLoading ? undefined : handleSubmit}
            loading={isLoading}
          >
            {isAddingLiquidity ? 'Add' : 'Remove'} liquidity
          </PrimaryButton>
        </StyledDivForFooter>
      </StyledDivForContent>
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
    <StyledDivForContent>
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
      <SecondaryButton
        onClick={handleApplyMaximumAmount}
        iconBefore={<PlusIcon />}
      >
        Provide max liquidity
      </SecondaryButton>
    </StyledDivForContent>
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
      <StyledDivForContent>
        <LiquidityInputSelector
          inputRef={percentageInputRef}
          maxLiquidity={availableLiquidityDollarValue}
          liquidity={liquidityToRemove}
          onChangeLiquidity={handleChangeLiquidity}
        />
        <StyledGridForDollarValueTxInfo>
          <Text
            type="microscopic"
            color="tertiaryText"
            paddingTop="12px"
            paddingBottom="18px"
          >
            Available liquidity: $
            {dollarValueFormatterWithDecimals(availableLiquidityDollarValue, {
              includeCommaSeparation: true,
            })}
          </Text>
          <Text
            type="microscopic"
            color="tertiaryText"
            paddingTop="12px"
            paddingBottom="18px"
          >
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
      </StyledDivForContent>
      <Divider offsetY={16} />
      <StyledDivForContent>
        <Text type="caption" paddingBottom="14px">
          Removing
        </Text>
        <StyledDivForLiquiditySummary>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenA.logoURI} alt={tokenA.name} />
            <Text type="microscopic" variant="light">
              {formatTokenBalance(tokenAReserve * liquidityPercentage)}{' '}
              {tokenA.symbol}
            </Text>
          </StyledDivForToken>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenB.logoURI} alt={tokenB.name} />
            <Text type="microscopic" variant="light">
              {formatTokenBalance(tokenBReserve * liquidityPercentage)}{' '}
              {tokenB.symbol}
            </Text>
          </StyledDivForToken>
        </StyledDivForLiquiditySummary>
      </StyledDivForContent>
    </>
  )
}

const StyledDivForContent = styled('div', {
  padding: '0px 28px',
  variants: {},
})

const StyledDivForTxRates = styled('div', {
  padding: '14px 0 24px',
})

const StyledDivForLiquidityInputs = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: 8,
})

const StyledDivForFooter = styled('div', {
  display: 'flex',
  justifyContent: 'flex-end',
  columnGap: 12,
  padding: '16px 0',
})

const StyledDivForDivider = styled('div', {
  paddingTop: 16,
})

const StyledGridForDollarValueTxInfo = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})

const StyledDivForLiquiditySummary = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: 24,
})

const StyledDivForToken = styled('div', {
  display: 'flex',
  alignItems: 'center',
  columnGap: 8,
})

const StyledImageForTokenLogo = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
})
