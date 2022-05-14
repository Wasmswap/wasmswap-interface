import { CSS } from '@stitches/react'
import {
  Chevron,
  IconWrapper,
  styled,
  Text,
  useOnClickOutside,
} from 'junoblocks'
import { useRef, useState } from 'react'
import { SLIPPAGE_OPTIONS } from 'util/constants'

type SlippageSelectorProps = {
  slippage: number
  onSlippageChange: (slippage: number) => void
  css?: CSS
}

export const SlippageSelector = ({
  slippage = 0.01,
  onSlippageChange,
  css,
}: SlippageSelectorProps) => {
  const [isShowingSettings, setShowingSettings] = useState(false)

  const refForWrapper = useRef()
  useOnClickOutside([refForWrapper], () => {
    setShowingSettings(false)
  })

  return (
    <StyledDivForWrapper ref={refForWrapper}>
      <StyledDivForSelector
        active={isShowingSettings}
        css={css}
        onClick={() => {
          setShowingSettings(!isShowingSettings)
        }}
      >
        <Text variant="legend">Slippage {slippage * 100}%</Text>
        <IconWrapper
          size="large"
          color="tertiary"
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
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: '$space$4',
  padding: '$6 $13',
  userSelect: 'none',
  borderRadius: '$2',
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
  backgroundColor: '$colors$light',
  padding: '$7',
  position: 'absolute',
  width: '284px',
  bottom: 'calc(100% + $space$2)',
  left: 0,
  borderRadius: '$1',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '13px',
  border: '1px solid $borderColors$default',
})

const StyledDivForSlippageList = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StyledButton = styled('button', {
  borderRadius: '$1',
  padding: '$4 $8',
  color: '$textColors$secondary',
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
