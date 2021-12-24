import Portal from '@reach/portal'
import styled from 'styled-components'
import gsap from 'gsap'
import { useEffect, useState, useRef, ReactNode } from 'react'
import { colorTokens } from '../util/constants'

type DialogProps = {
  children: ReactNode
  isShowing: boolean
  onRequestClose: () => void
  kind?: 'blank'
  width?: 'normal' | 'large'
}

const paddingX = 18

export const Dialog = ({
  children,
  isShowing,
  onRequestClose,
  kind,
  ...props
}: DialogProps) => {
  const [isRenderingDialog, setIsRenderingDialog] = useState(false)
  const modalRef = useRef()
  const overlayRef = useRef()

  // render the dialog
  useEffect(() => {
    if (isShowing) {
      setIsRenderingDialog(true)
    }
  }, [isShowing])

  useEffect(() => {
    const shouldAnimateCloseOut = !isShowing && isRenderingDialog

    const tl = gsap.timeline({
      duration: 0.35,
      ease: 'power.easeOut',
    })

    if (shouldAnimateCloseOut) {
      tl.to(modalRef.current, { opacity: 0 }, 0)
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          onComplete() {
            // unmount the dialog
            setIsRenderingDialog(false)
          },
        },
        0
      )
    }

    if (isShowing && isRenderingDialog) {
      tl.to(overlayRef.current, { opacity: 0.6 }, 0)
      tl.to(modalRef.current, { opacity: 1 }, 0.1)
      return
    }
  }, [isRenderingDialog, isShowing])

  return (
    <Portal>
      {(isShowing || isRenderingDialog) && (
        <>
          <StyledDivForModal ref={modalRef} {...props}>
            {kind !== 'blank' && (
              <StyledCloseIcon offset={paddingX} onClick={onRequestClose} />
            )}
            {children}
          </StyledDivForModal>
          <StyledDivForOverlay
            role="presentation"
            onClick={onRequestClose}
            ref={overlayRef}
          />
        </>
      )}
    </Portal>
  )
}

export const DialogBody = styled.div`
  padding: ${paddingX}px;
`

const StyledDivForModal = styled.div`
  opacity: 0;
  width: 456px;
  position: absolute;
  z-index: 99;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colorTokens.lightGray};
  border-radius: 6px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
`

const StyledDivForOverlay = styled.div`
  opacity: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 98;
  left: 0;
  top: 0;
  background-color: #000;
`

const CloseIcon = (props) => (
  <svg
    {...props}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
      fill="currentColor"
    />
  </svg>
)

export const StyledCloseIcon = styled(CloseIcon)`
  width: ${(p) => p.size || '24px'};
  height: ${(p) => p.size || '24px'};
  color: #323232;
  display: block;
  transition: opacity 0.15s ease-out;
  cursor: pointer;
  margin-left: auto;
  margin-right: ${(p) => p.offset}px;
  margin-top: ${(p) => p.offset}px;
  &:hover {
    opacity: 0.75;
  }
`
