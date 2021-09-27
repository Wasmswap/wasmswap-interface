import React from 'react'
import styled from 'styled-components'
import { NavigationBar } from './NavigationBar'
import { FooterBar } from './FooterBar'
import { AppBackground } from './AppBackground'
import { ToastContainer } from 'react-toastify'

export default function Layout({ children }) {
  return (
    <AppBackground>
      <StyledWrapper>
        <NavigationBar />
        <main>{children}</main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
