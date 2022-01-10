import React from 'react'
import { Text } from '../Text'

export const PageHeader = ({ title, subtitle }) => {
  return (
    <>
      <Text variant="hero" css={{ padding: '$16 0 $9' }}>
        {title}
      </Text>
      <Text variant="header" css={{ paddingBottom: '$14' }}>
        {subtitle}
      </Text>
    </>
  )
}
