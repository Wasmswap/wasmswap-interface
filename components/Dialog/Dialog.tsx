import Portal from '@reach/portal'
import { styled, useThemeClassName } from 'components/theme'
import gsap from 'gsap'
import { useEffect, useState, useRef, ReactNode } from 'react'
import { DialogContextProvider } from './DialogContext'

type DialogProps = {
  children: ReactNode
  isShowing: boolean
  onRequestClose: () => void
}

export const Dialog = ({
  children,
  isShowing,
  onRequestClose,
  ...props
}: DialogProps) => {
  const [isRenderingDialog, setIsRenderingDialog] = useState(false)
  const themeClassName = useThemeClassName()

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
      tl.to(overlayRef.current, { opacity: 0.75 }, 0)
      tl.to(modalRef.current, { opacity: 1 }, 0.1)
      return
    }
  }, [isRenderingDialog, isShowing])

  return (
    <Portal>
      {(isShowing || isRenderingDialog) && (
        <DialogContextProvider
          onRequestClose={onRequestClose}
          isShowing={isShowing}
        >
          <StyledDivForModal
            className={themeClassName}
            ref={modalRef}
            {...props}
          >
            {children}
          </StyledDivForModal>
          <StyledDivForOverlay
            className={themeClassName}
            role="presentation"
            onClick={onRequestClose}
            ref={overlayRef}
          />
        </DialogContextProvider>
      )}
    </Portal>
  )
}

const StyledDivForModal = styled('div', {
  opacity: 0,
  width: '28rem',
  maxWidth: '95%',
  position: 'absolute',
  zIndex: 99,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '$backgroundColors$base',
  borderRadius: '$1',
  border: '1px solid $borderColors$default',
})

const StyledDivForOverlay = styled('div', {
  opacity: 0,
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  zIndex: 98,
  left: 0,
  top: 0,
  backgroundColor: '$colors$light',
})
