import React, { FC, ComponentProps } from 'react'
import Image from 'next/image'
import styled from 'styled-components'

type SpinnerProps = Omit<ComponentProps<typeof Image>, 'src' | 'alt'> & {
  width?: number
  height?: number
}

export const Spinner: FC<SpinnerProps> = ({
  width = 24,
  height = 24,
  ...rest
}) => (
  <StyledImage
    {...rest}
    src="/spinner.svg"
    alt="loading"
    width={width}
    height={height}
  />
)

const StyledImage = styled(Image)`
  animation: spin 1s linear infinite;
  will-change: transform;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
