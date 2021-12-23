import React, { FC, SVGProps, useEffect, useState } from 'react'
import styled from 'styled-components'
import { colorTokens } from '../util/constants'

type SpinnerProps = SVGProps<SVGSVGElement> & {
  isLoading?: boolean
  size?: number
  color?: keyof typeof colorTokens
  instant?: boolean
}

export const Spinner: FC<SpinnerProps> = ({
  size = 24,
  color = 'white',
  instant = false,
  isLoading = true,
  ...rest
}) => {
  const isVisible = useIsLoadingDelayed(isLoading)
  return (
    <StyledSvg
      {...rest}
      $color={color}
      $visible={instant || isVisible}
      src="/spinner.svg"
      alt="loading"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        r="23"
        strokeDasharray="108.38494654884786 38.12831551628262"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1.0526315789473684s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        />
      </circle>
    </StyledSvg>
  )
}

const StyledSvg = styled.svg`
  animation: spin 1s linear infinite, opacity 0.15s ease-out;
  will-change: transform;
  margin: auto;
  background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
  display: block;
  shape-rendering: auto;
  color: ${(p) => colorTokens[p.$color] || p.$color};
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const useIsLoadingDelayed = (loading: boolean) => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      let timeout = setTimeout(() => {
        setIsLoading(true)
      }, 350)

      return () => clearTimeout(timeout)
    }

    setIsLoading(false)
  }, [loading])

  return isLoading
}
