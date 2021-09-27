import { useTransition, animated } from '@react-spring/web'
import Portal from '@reach/portal'
import styled from 'styled-components'

export const Dialog = ({ children, isShowing, onRequestClose }) => {
  const transitions = useTransition(isShowing, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: isShowing,
  })

  return (
    <Portal>
      {transitions(
        ({ opacity }, item) =>
          item && (
            <>
              <StyledDivForModal style={{ opacity }}>
                <StyledCloseIcon onClick={onRequestClose} />
                {children}
              </StyledDivForModal>
              <StyledDivForOverlay
                role="presentation"
                onClick={onRequestClose}
                style={{ opacity: opacity.to([0, 1], [0, 0.6]) }}
              />
            </>
          )
      )}
    </Portal>
  )
}

export const DialogBody = styled.div`
  padding: 0 72px 40px;
`

const StyledDivForModal = styled(animated.div)`
  width: 508px;
  position: absolute;
  z-index: 99;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.02);
  padding: 16px;
`

const StyledDivForOverlay = styled(animated.div)`
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

const StyledCloseIcon = styled(CloseIcon)`
  width: 24px;
  height: 24px;
  color: #323232;
  display: block;
  transition: opacity 0.15s ease-out;
  cursor: pointer;
  &:hover {
    opacity: 0.75;
  }
`
