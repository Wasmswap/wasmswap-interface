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
        <script type="text/javascript">
          {`window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
  heap.load("1163871224");`}
        </script>
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
