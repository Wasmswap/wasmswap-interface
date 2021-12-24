import { styled } from '@stitches/react'
import { Text } from '../../../components/Text'
import { IconWrapper } from '../../../components/IconWrapper'
import { Chevron } from '../../../icons/Chevron'
import { useRef, useState } from 'react'
import { colorTokens, SLIPPAGE_OPTIONS } from '../../../util/constants'
import { useOnClickOutside } from '../../../hooks/useOnClickOutside'

type SlippageSelectorProps = {
  slippage: number
  onSlippageChange: (slippage: number) => void
}
export const SlippageSelector = ({
  slippage = 0.01,
  onSlippageChange,
}: SlippageSelectorProps) => {
  const [isShowingSettings, setShowingSettings] = useState(false)

  const refForWrapper = useRef()
  useOnClickOutside(refForWrapper, () => {
    setShowingSettings(false)
  })

  return (
    <StyledDivForWrapper ref={refForWrapper}>
      <StyledDivForSelector
        active={isShowingSettings}
        onClick={() => {
          setShowingSettings(!isShowingSettings)
        }}
      >
        <Text type="microscopic" variant="normal" color="disabled">
          Slippage {slippage * 100}%
        </Text>
        <IconWrapper
          size="16px"
          color="tertiaryIcon"
          icon={<Chevron />}
          rotation={isShowingSettings ? '90deg' : '-90deg'}
        />
      </StyledDivForSelector>
      {isShowingSettings && (
        <StyledDivForPopover>
          <Text type="microscopic" variant="normal" color="tertiaryText">
            Your transaction will not complete if price slips below target
            threshold.
          </Text>
          <StyledDivForSlippageList>
            {SLIPPAGE_OPTIONS.map((tolerance) => (
              <StyledButton
                active={slippage === tolerance}
                key={tolerance}
                onClick={() => {
                  onSlippageChange(tolerance)
                  setShowingSettings(false)
                }}
              >
                <Text type="caption">{tolerance * 100}%</Text>
              </StyledButton>
            ))}
          </StyledDivForSlippageList>
        </StyledDivForPopover>
      )}
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  position: 'relative',
})

const StyledDivForSelector = styled('button', {
  textTransform: 'uppercase',
  display: 'flex',
  columnGap: '8px',
  padding: '16px 26px',
  userSelect: 'none',
  borderRadius: '8px 0 0 8px',
  transition: 'background-color .1s ease-out',
  '&:hover': {
    backgroundColor: 'rgba(25, 29, 32, 0.15)',
  },
  '&:active': {
    backgroundColor: 'rgba(25, 29, 32, 0.05)',
  },

  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(25, 29, 32, 0.15)',
      },
      false: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
      },
    },
  },
})

const StyledDivForPopover = styled('div', {
  textTransform: 'none',
  backgroundColor: '#DADBDB',
  padding: '14px',
  position: 'absolute',
  width: '284px',
  bottom: 'calc(100% + 4px)',
  left: 0,
  borderRadius: '6px',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '13px',
  border: '1px solid rgba(25, 29, 32, 0.25)',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
})

const StyledDivForSlippageList = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledButton = styled('button', {
  borderRadius: '6px',
  padding: '8px 15px',
  color: colorTokens.secondaryText,
  transition: 'background-color .1s ease-out',
  variants: {
    active: {
      true: {
        backgroundColor: 'rgba(25, 29, 32, 0.1)',
      },
      false: {
        backgroundColor: 'rgba(25, 29, 32, 0)',
      },
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(25, 29, 32, 0.15)',
  },
  '&:active': {
    backgroundColor: 'rgba(25, 29, 32, 0.05)',
  },
})
