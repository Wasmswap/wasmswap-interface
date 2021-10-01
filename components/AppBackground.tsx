import React, { Suspense } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { SpringModel } from './SpringModel'
import { useRecoilValue } from 'recoil'
import { transactionStatusState } from '../state/atoms/transactionAtoms'
import { walletState } from '../state/atoms/walletAtoms'

const USE_3D_SPRINGS = false

export const AppBackground = ({ children }) => {
  const transactionStatus = useRecoilValue(transactionStatusState)
  const { address } = useRecoilValue(walletState)

  return (
    <>
      <StyledBackgroundWrapper>
        {USE_3D_SPRINGS ? (
          <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback="loading....">
              <ambientLight intensity={0.75} />
              <spotLight position={[15, 15, 20]} penumbra={0.5} angle={0.2} />
              <directionalLight position={[0, 5, -4]} intensity={2} />
              <directionalLight position={[0, -15, -0]} intensity={2} />
              <SpringModel
                isSpinning={transactionStatus === 'EXECUTING_SWAP'}
                isShowing={Boolean(address)}
              />
            </Suspense>
          </Canvas>
        ) : (
          <>
            <StyledSpringLeft src="/spring-left.png" />
            <StyledSpringRight src="/spring-right.png" />
          </>
        )}
      </StyledBackgroundWrapper>
      <StyledContent>{children}</StyledContent>
    </>
  )
}

const StyledBackgroundWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
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
