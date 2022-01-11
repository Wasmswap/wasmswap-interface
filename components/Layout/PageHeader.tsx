import React from 'react'
import { Text } from '../Text'
import Head from 'next/head'
import { APP_NAME } from '../../util/constants'

export const PageHeader = ({ title, subtitle }) => {
  return (
    <>
      <Head>
        <title>
          {APP_NAME} — {title}
        </title>
      </Head>
      <Text variant="header" css={{ padding: '$16 0 $9' }}>
        {title}
      </Text>
      <Text variant="body" css={{ paddingBottom: '$14' }}>
        {subtitle}
      </Text>
    </>
  )
}
