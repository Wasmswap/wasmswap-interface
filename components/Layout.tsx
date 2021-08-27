import React from 'react'
import styled from 'styled-components'
import { NavigationBar } from './NavigationBar'
import { FooterBar } from './FooterBar'
import { AppBackground } from './AppBackground'

export default function Layout({ children }) {
  return (
    <AppBackground>
      <StyledWrapper>
        <NavigationBar />
        <main>{children}</main>
        <FooterBar />
      </StyledWrapper>
    </AppBackground>
  )
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
`
