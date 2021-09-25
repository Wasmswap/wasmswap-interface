import styled from 'styled-components'
import { colorTokens } from '../util/constants'
import { resetStylesForButton } from './Button'
import { HTMLProps, useMemo, useState } from 'react'
import { animated, useSpring } from '@react-spring/web'

type SegmentedControllerProps = {
  tabs: Array<{ value: string; label: string }>
  currentTab: string
  onChangeTab: (tabValue: string) => void
} & HTMLProps<HTMLDivElement>

export const SegmentedController = ({
  tabs = [],
  currentTab,
  onChangeTab,
  ...props
}: SegmentedControllerProps) => {
  const tabWidth = 100 / tabs.length
  const tabIndex = useMemo(
    () => tabs.findIndex(({ value }) => value === currentTab),
    [currentTab, tabs]
  )

  const { x } = useSpring({
    x: tabIndex * 100,
  })

  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <StyledDivForWrapper {...props}>
      {tabs.map(({ label, value }, idx) => {
        return (
          <StyledButtonForController
            as="button"
            key={value}
            onClick={() => onChangeTab(value)}
            $width={tabWidth}
            $active={currentTab === value}
            $hovered={hoveredIndex === idx}
            onMouseEnter={() => {
              setHoveredIndex(idx)
            }}
            onMouseLeave={() => {
              setHoveredIndex(null)
            }}
          >
            {label}
          </StyledButtonForController>
        )
      })}
      <StyledDivForIndicator
        $width={tabWidth}
        style={{
          transform: x.to((value) => `translateX(${value}%)`),
        }}
      />
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled.div`
  border-radius: 34px;
  border: 2px solid ${colorTokens.primary};
  padding: 2px;
  position: relative;
`

const StyledButtonForController = styled.button<{
  $width: number
  $hovered: boolean
}>`
  ${resetStylesForButton};
  background-color: ${(p) =>
    p.$hovered && !p.$active ? '#D9E8FA' : 'transparent'};
  color: ${(p) => (p.$active ? colorTokens.white : colorTokens.primary)};
  width: ${(p) => `${p.$width}%`};
  font-weight: 400;
  position: relative;
  border-radius: 100px;
  z-index: 1;
  padding: 5px 0;
  transition: background-color 0.1s ease-out;
`

const StyledDivForIndicator = styled(animated.div)<{
  $width: number
}>`
  position: absolute;
  left: 2px;
  top: 2px;
  height: calc(100% - 4px);
  width: calc(${(p) => `${p.$width}%`} - 2px);
  transform: translateX(0%);
  background-color: ${colorTokens.primary};
  border-radius: 100px;
  z-index: 0;
`
