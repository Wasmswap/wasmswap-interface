import React from 'react'
import styled from 'styled-components'

export const AppBackground = ({ children }) => {
  return (
    <>
      <StyledBackgroundWrapper>
        <StyledSpringLeft src="/spring-left.png" />
        <StyledSpringRight src="/spring-right.png" />
      </StyledBackgroundWrapper>
      <StyledContent>{children}</StyledContent>
    </>
  )
}

const StyledBackgroundWrapper = styled.div`
  position: absolute;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
`

const StyledSpringLeft = styled.img`
  position: absolute;
  left: -50%;
  bottom: -90%;
  width: 120%;
  z-index: 0;
  max-width: 3000px;
`

const StyledSpringRight = styled.img`
  position: absolute;
  right: -40%;
  top: -80%;
  width: 100%;
  z-index: 0;
`

const StyledContent = styled.div`
  position: relative;
  z-index: 1;
`
