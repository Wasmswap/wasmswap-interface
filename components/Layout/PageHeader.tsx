import React from 'react'
import { Text } from '../Text'
import styled from 'styled-components'

export const PageHeader = ({ title, subtitle }) => {
  return (
    <>
      <StyledTitle type="title" variant="bold">
        {title}
      </StyledTitle>
      <StyledSubtitle type="body" variant="light">
        {subtitle}
      </StyledSubtitle>
    </>
  )
}

const StyledTitle = styled(Text)`
  padding: 32px 0 18px;
`

const StyledSubtitle = styled(Text)`
  padding-bottom: 29px;
`
