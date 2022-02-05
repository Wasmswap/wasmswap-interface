import React from 'react'
import { Text } from '../Text'
import Head from 'next/head'
import { APP_NAME } from '../../util/constants'
import { useMedia } from '../../hooks/useMedia'

export const PageHeader = ({ title, subtitle }) => {
  const isSmall = useMedia('sm')

  return (
    <>
      <Head>
        <title>
          {APP_NAME} — {title}
        </title>
      </Head>
      <Text variant="header" css={{ padding: isSmall ? '$15 0 $6' : '$10 0' }}>
        {title}
      </Text>
      <Text variant="body" css={{ paddingBottom: isSmall ? '$12' : '$16' }}>
        {subtitle}
      </Text>
    </>
  )
}
