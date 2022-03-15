import { CSS } from '@stitches/react'

import { themeColorTokens } from '../colors'

export function createColorVariants<T extends keyof typeof themeColorTokens>(
  themeColorTokensName: T,
  renderer: (tokenName: string) => CSS
) {
  return Object.keys(themeColorTokens[themeColorTokensName]).reduce(
    (colorVariants, colorToken) => ({
      ...colorVariants,
      [colorToken]: renderer(colorToken),
    }),
    {} as Record<keyof typeof themeColorTokens[T], CSS>
  )
}
