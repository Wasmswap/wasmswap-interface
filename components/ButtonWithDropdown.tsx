import { Portal } from '@reach/portal'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { styled } from 'theme'

import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { Button, ButtonProps } from './Button'

type Props = ButtonProps & {
  dropdown: ReactNode
}

export const ButtonWithDropdown = ({ dropdown, ...buttonProps }: Props) => {
  const buttonRef = useRef()
  const dropdownRef = useRef()

  const [requestToShowDropdown, setRequestToShowDropdown] = useState(false)
  const [dropdownShowing, setDropdownShowing] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (requestToShowDropdown) {
      const clientRect = (
        buttonRef.current as HTMLButtonElement
      ).getBoundingClientRect()

      setPosition({
        left: clientRect.left,
        top: clientRect.top + clientRect.height + window.pageYOffset,
      })

      setDropdownShowing(true)
    } else {
      setDropdownShowing(false)
    }
  }, [requestToShowDropdown])

  useOnClickOutside(
    dropdownShowing ? [dropdownRef, buttonRef] : [null, null],
    () => {
      setRequestToShowDropdown(false)
    }
  )

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        selected={dropdownShowing}
        dropdownVisible={dropdownShowing}
        onClick={(event) => {
          setRequestToShowDropdown(!requestToShowDropdown)
          buttonProps.onClick?.(event)
        }}
        {...buttonProps}
      />
      {dropdownShowing && (
        <Portal>
          <StyledDivForDropdownWrapper ref={dropdownRef} css={position}>
            <StyledDivForDropdown>{dropdown}</StyledDivForDropdown>
          </StyledDivForDropdownWrapper>
        </Portal>
      )}
    </>
  )
}

const StyledDivForDropdownWrapper = styled('div', {
  backgroundColor: '$colors$white',
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 99,
  borderRadius: '0px $2 $2 $2',
})

const StyledDivForDropdown = styled('div', {
  backgroundColor: '$colors$dark5',
  borderRadius: '0px $2 $2 $2',
  boxShadow: '0px 6px 8px rgba(25, 29, 32, 0.1)',
})
