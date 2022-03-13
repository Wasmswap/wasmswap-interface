import Portal from '@reach/portal'
import { styled, useThemeClassName } from 'theme'
import gsap from 'gsap'
import { useEffect, useState, useRef, ReactNode } from 'react'
import { DialogContextProvider } from './DialogContext'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

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

  const modalRef = useRef<HTMLDivElement>()
  const overlayRef = useRef<HTMLDivElement>()

  // render the dialog
  useEffect(() => {
    if (isShowing) {
      setIsRenderingDialog(true)
    }
  }, [isShowing])

  /* animate the dialog */
  useEffect(() => {
    function getShouldCenterDialog() {
      return (
        modalRef.current.getBoundingClientRect().height <=
        window.innerHeight * 0.95
      )
    }

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
      tl.set(
        modalRef.current,
        {
          alignSelf: getShouldCenterDialog() ? 'center' : 'flex-start',
        },
        0
      )

      tl.to(overlayRef.current, { opacity: 0.75 }, 0)
      tl.to(modalRef.current, { opacity: 1 }, 0.1)
      return
    }
  }, [isRenderingDialog, isShowing])

  /* lock the scroll */
  useEffect(() => {
    if (isShowing) {
      const rootNode = document.querySelector('#__next')

      disableBodyScroll(rootNode)
      return () => enableBodyScroll(rootNode)
    }
  }, [isShowing])

  return (
    <Portal>
      {(isShowing || isRenderingDialog) && (
        <DialogContextProvider
          onRequestClose={onRequestClose}
          isShowing={isShowing}
        >
          <StyledDivForScroller>
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
          </StyledDivForScroller>
        </DialogContextProvider>
      )}
    </Portal>
  )
}

const StyledDivForScroller = styled('div', {
  padding: '$12',
  height: '100vh',
  width: '100%',
  overflowY: 'scroll',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  zIndex: 99,
  position: 'fixed',
  left: 0,
  top: 0,
})

const StyledDivForModal = styled('div', {
  opacity: 0,
  width: '28rem',
  maxWidth: '95%',
  backgroundColor: '$backgroundColors$base',
  borderRadius: '$1',
  border: '1px solid $borderColors$default',
  position: 'relative',
  zIndex: '$2',
})

const StyledDivForOverlay = styled('div', {
  opacity: 0,
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  zIndex: '$1',
  left: 0,
  top: 0,
  backgroundColor: '$colors$light',
})
