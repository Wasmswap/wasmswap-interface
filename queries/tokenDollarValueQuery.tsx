import { ErrorIcon, Toast } from 'junoblocks'
import React from 'react'
import { toast } from 'react-hot-toast'

import { TokenInfo } from '../hooks/useTokenList'

const pricingServiceIsDownAlert = createAlertPricingServiceIsDown()

export async function tokenDollarValueQuery(tokenIds: Array<TokenInfo['id']>) {
  const prices = await fetchTokensPrice(tokenIds)
  return tokenIds.map((id): number => prices[id]?.usd || 0)
}

async function fetchTokensPrice(tokenIds: Array<string>) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(
      ','
    )}&vs_currencies=usd`,
    {
      method: 'GET',
    }
  )

  if (!response.ok) {
    pricingServiceIsDownAlert()
    throw new Error('Cannot fetch dollar price from the API.')
  }

  return response.json()
}

function createAlertPricingServiceIsDown() {
  let hasRenderedAlert
  let timeout

  function renderAlert() {
    toast.custom((t) => (
      <Toast
        icon={<ErrorIcon />}
        title="Oops, sorry! Our pricing service is temporarily down"
        onClose={() => toast.dismiss(t.id)}
      />
    ))
  }

  return () => {
    if (hasRenderedAlert) {
      clearTimeout(timeout)
      timeout = setTimeout(renderAlert, 60 * 1000)
      return
    }

    hasRenderedAlert = true
    renderAlert()
  }
}
