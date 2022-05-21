type ApiResponse = Record<string, { usd: number }>

class DollarPriceFetcher {
  queuedTokenIds: Array<string> = []
  apiPromises: Record<string, Promise<ApiResponse>> = {}
  timeout: NodeJS.Timeout

  async fetchTokenPrices(tokenIds: Array<string>) {
    const apiIds = tokenIds.join(',')

    if (this.apiPromises[apiIds]) {
      return this.apiPromises[apiIds]
    }

    this.apiPromises[apiIds] = fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${apiIds}&vs_currencies=usd`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .finally(() => {
        this.debounceCleanUpPromise(apiIds)
      })

    return this.apiPromises[apiIds]
  }

  async fetch(tokenIds: Array<string>) {
    this.queuedTokenIds = [...this.queuedTokenIds, ...tokenIds]

    return this.debounceFetch()
  }

  debounceCleanUpPromise = (apiIds: string) => {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      delete this.apiPromises[apiIds]
    }, 300)
  }

  debounceFetch = () => {
    return new Promise<ApiResponse>((resolve) => {
      setTimeout(async () => {
        const response = await this.fetchTokenPrices(this.queuedTokenIds)
        resolve(response)
      }, 35)
    })
  }
}

export const dollarPriceFetcher = new DollarPriceFetcher()
