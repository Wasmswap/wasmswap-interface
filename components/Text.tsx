import React, { ForwardedRef, forwardRef, HTMLProps } from 'react'
import styled, { css } from 'styled-components'
import { colorTokens, fonts, spaces } from '../util/constants'

const fontWeightTokens = {
  bold: 600,
  normal: 500,
  light: 400,
}

type TextProps = {
  type?:
    | 'heading'
    | 'title'
    | 'title2'
    | 'title3'
    | 'body'
    | 'subtitle'
    | 'caption'
    | 'microscopic'
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize'
  font?: keyof typeof fonts
  color?: keyof typeof colorTokens | string
  variant?: keyof typeof fontWeightTokens
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  paddingY?: string
  paddingX?: string
}

const colorTokenSelector = (props: TextProps) => {
  return colorTokens[props.color] || props.color || colorTokens.black
}

const fontWeightSelector = (props: TextProps) => {
  return fontWeightTokens[props.variant] || fontWeightTokens.normal
}

const fontFamilySelector = (props: TextProps) => {
  return fonts[props.font] || fonts.primary
}

const paddingMixin = css`
  ${(p) =>
    p.paddingTop ? `padding-top: ${spaces[p.paddingTop] || p.paddingTop}` : ''};
  ${(p) =>
    p.paddingBottom
      ? `padding-bottom: ${spaces[p.paddingBottom] || p.paddingBottom}`
      : ''};
  ${(p) =>
    p.paddingLeft
      ? `padding-left: ${spaces[p.paddingLeft] || p.paddingLeft}`
      : ''};
  ${(p) =>
    p.paddingRight
      ? `padding-right: ${spaces[p.paddingRight] || p.paddingRight}`
      : ''};
  ${(p) =>
    p.paddingY || p.paddingX
      ? `padding: ${p.paddingY || 0} ${p.paddingX || 0}`
      : ''};
`

const textTransformMixin = css`
  ${(p) =>
    p.textTransform ? `text-transform: ${p.textTransform};` : undefined}
`

const wrapMixin = css`
  ${(p) => (p.wrap ? `white-space: ${p.wrap};` : undefined)}
`

const mixins = css`
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  font-family: ${fontFamilySelector};
  ${paddingMixin};
  ${textTransformMixin};
  ${wrapMixin};
`

const Title = styled.p<TextProps>`
  font-size: 32px;
  line-height: 44px;
  ${mixins};
`

const Title2 = styled.p<TextProps>`
  font-size: 30px;
  line-height: 24px;
  ${mixins};
`

const Title3 = styled.p<TextProps>`
  font-size: 22px;
  line-height: 24px;
  ${mixins};
`

const Heading = styled.p<TextProps>`
  font-size: 20px;
  line-height: 27px;
  ${mixins};
`

const Paragraph = styled.p<TextProps>`
  font-size: 18px;
  line-height: 24px;
  ${mixins};
`

const Subtitle = styled.p<TextProps>`
  font-size: 16px;
  line-height: 18px;
  ${mixins};
`

const Caption = styled.p<TextProps>`
  font-size: 14px;
  line-height: 18px;
  ${mixins};
`

const Microscopic = styled.p<TextProps>`
  font-size: 12px;
  line-height: 16px;
  ${mixins};
`

const map = {
  body: Paragraph,
  caption: Caption,
  heading: Heading,
  title: Title,
  title2: Title2,
  title3: Title3,
  subtitle: Subtitle,
  microscopic: Microscopic,
}

const TextComponent = (
  {
    type = 'body',
    variant = 'normal',
    ...props
  }: TextProps & HTMLProps<HTMLParagraphElement>,
  ref: ForwardedRef<any>
) => {
  const TextComponent = map[type] || Paragraph
  return <TextComponent ref={ref} variant={variant} {...props} />
}

export const Text = forwardRef(TextComponent) as typeof TextComponent
