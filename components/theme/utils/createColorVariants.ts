import { CSS } from '@stitches/react'

export const createColorVariants = (
  colorTokens: Record<string, string>,
  renderer: (tokenName: string) => CSS
) => {
  return Object.keys(colorTokens).reduce(
    (colorVariants, colorToken) => ({
      ...colorVariants,
      [colorToken]: renderer(colorToken),
    }),
    {} as Record<keyof typeof colorTokens, CSS>
  )
}
