import { Text, useMedia } from 'junoblocks'
import Head from 'next/head'
import React from 'react'

import { APP_NAME } from '../../util/constants'

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
