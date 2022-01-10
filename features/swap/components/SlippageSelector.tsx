import { styled } from 'components/theme'
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
        <Text variant="caption" css={{ fontWeight: '$bold' }} color="disabled">
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
          <Text variant="caption" color="tertiary">
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
                <Text variant="body">{tolerance * 100}%</Text>
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
  columnGap: '$space$4',
  padding: '$8 $13',
  userSelect: 'none',
  borderRadius: '$2 0 0 $2',
  transition: 'background-color .1s ease-out',
  '&:hover': {
    backgroundColor: '$colors$dark15',
  },
  '&:active': {
    backgroundColor: '$colors$dark5',
  },

  variants: {
    active: {
      true: {
        backgroundColor: '$colors$dark15',
      },
      false: {
        backgroundColor: '$colors$dark10',
      },
    },
  },
})

const StyledDivForPopover = styled('div', {
  textTransform: 'none',
  backgroundColor: '#DADBDB',
  padding: '$7',
  position: 'absolute',
  width: '284px',
  bottom: 'calc(100% + 4px)',
  left: 0,
  borderRadius: '$1',
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
  borderRadius: '$1',
  padding: '$4 $8',
  color: colorTokens.secondaryText,
  transition: 'background-color .1s ease-out',
  variants: {
    active: {
      true: {
        backgroundColor: '$dark10',
      },
      false: {
        backgroundColor: '$dark0',
      },
    },
  },
  '&:hover': {
    backgroundColor: '$dark15',
  },
  '&:active': {
    backgroundColor: '$dark5',
  },
})
