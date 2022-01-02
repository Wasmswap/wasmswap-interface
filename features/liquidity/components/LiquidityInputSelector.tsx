import { styled } from '@stitches/react'
import { Text } from '../../../components/Text'
import { dollarValueFormatter } from '../../../util/conversion'
import { MouseEvent, useRef, useState } from 'react'
import { useAmountChangeController } from 'hooks/useAmountChangeController'
import { calculateCharactersLength } from 'components/BasicNumberInput'

type LiquiditySelectorProps = {
  maxLiquidity: number
  liquidity: number
  onChangeLiquidity: (liquidity: number) => void
}

export const LiquidityInputSelector = ({
  maxLiquidity,
  liquidity,
  onChangeLiquidity,
}: LiquiditySelectorProps) => {
  const { value, setValue } = useAmountChangeController({
    amount: (dollarValueFormatter(liquidity / maxLiquidity) as number) * 100,
    minimumValue: 0,
    maximumValue: 100,
    maximumFractionDigits: 2,
    onAmountChange(updateValue) {
      onChangeLiquidity((updateValue / 100) * maxLiquidity)
    },
  })

  const refForInputWrapper = useRef<HTMLElement>()
  const { bind, isDragging } = useDrag({
    getIsException(e) {
      return refForInputWrapper.current.contains(e.target)
    },
    onProgressUpdate(progress) {
      const value = Math.max(Math.min(progress * maxLiquidity, maxLiquidity), 0)

      onChangeLiquidity(value)
    },
  })

  return (
    <StyledDivForSelector {...(bind as any)}>
      <StyledTextForInputWithSymbol ref={refForInputWrapper} variant="light">
        <input
          placeholder="0.0"
          max="100"
          type="number"
          value={value}
          style={{
            width: `${calculateCharactersLength(value)}ch`,
          }}
          onChange={({ target: { value } }) => setValue(value)}
        />
        <span>%</span>
      </StyledTextForInputWithSymbol>
      <StyledDivForProgress
        enableTransition={!isDragging}
        css={{ width: `${value}%` }}
      />
    </StyledDivForSelector>
  )
}

const useDrag = ({ getIsException, onProgressUpdate }) => {
  const ref = useRef<HTMLElement>()
  const dragging = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  function handleMouseMove(e: MouseEvent<HTMLDivElement, MouseEvent>) {
    if (dragging.current) {
      const { clientX } = e
      const { left, width } = ref.current.getBoundingClientRect()
      const progress = Math.max((clientX - left) / width, 0)
      onProgressUpdate(
        Math.min(progress > 0.99 ? 1 : Number(progress.toFixed(2)), 1)
      )
    }
  }

  function handleMouseDown(e) {
    if (!getIsException(e)) {
      /* detach mouse up listener on global mouse up event */
      window.addEventListener('mouseup', handleMouseUp)

      dragging.current = true
      setIsDragging(true)
      handleMouseMove(e)
    }
  }

  function handleMouseUp() {
    dragging.current = false
    setIsDragging(false)
  }

  return {
    isDragging,
    bind: {
      ref,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      style: {
        userSelect: isDragging ? 'none' : 'unset',
      },
    },
  }
}

const StyledDivForSelector = styled('div', {
  background: 'rgba(25, 29, 32, 0.1)',
  borderRadius: '6px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 0',
})

const StyledTextForInputWithSymbol: any = styled(Text, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  zIndex: 1,
})

const StyledDivForProgress = styled('div', {
  backgroundColor: 'rgba(25, 29, 32, 0.1)',
  position: 'absolute',
  inset: '0 auto auto 0',
  width: '100%',
  height: '100%',
  zIndex: 0,
  variants: {
    enableTransition: {
      true: {
        transition: 'width .1s ease-out',
      },
      false: {
        transition: 'none',
      },
    },
  },
})
