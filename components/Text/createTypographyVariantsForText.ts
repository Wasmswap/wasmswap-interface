import { CSS } from '@stitches/react'
import { typography } from 'theme/typography'

type TypographyVariantsForText = {
  [variantName: string]: CSS
}

/* based on entries in typography this will create a set of variant types
 * eg { product__hero: CSS } */
export function createTypographyVariantsForText(): TypographyVariantsForText {
  return Object.keys(typography).reduce((variants, variantKindName) => {
    for (const variantName in typography[variantKindName]) {
      const fontFamily = `$${typography[variantKindName][variantName]?.font}`
      variants[`${variantKindName}__${variantName}`] = {
        $$color: `$fontColors$${variantKindName}$${variantName}`,
        fontSize: `$fontSizes$${variantKindName}$${variantName}`,
        lineHeight: `$lineHeight$${variantKindName}$${variantName}`,
        fontWeight: `$fontWeight$${variantKindName}$${variantName}`,
        fontFamily,
      }
    }

    return variants
  }, {})
}
