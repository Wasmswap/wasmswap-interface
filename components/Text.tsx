import React, { ForwardedRef, forwardRef, HTMLProps } from 'react'
import styled, { css } from 'styled-components'
import { colorTokens, spaces } from '../util/constants'

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
  color?: keyof typeof colorTokens
  variant?: keyof typeof fontWeightTokens
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  paddingY?: string
  paddingX?: string
}

const colorTokenSelector = (props: TextProps) => {
  return colorTokens[props.color] || colorTokens.black
}

const fontWeightSelector = (props: TextProps) => {
  return fontWeightTokens[props.variant] || fontWeightTokens.normal
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

const Title = styled.p<TextProps>`
  font-size: 32px;
  line-height: 44px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Title2 = styled.p<TextProps>`
  font-size: 30px;
  line-height: 24px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Title3 = styled.p<TextProps>`
  font-size: 22px;
  line-height: 24px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Heading = styled.p<TextProps>`
  font-size: 20px;
  line-height: 27px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Paragraph = styled.p<TextProps>`
  font-size: 18px;
  line-height: 24px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Subtitle = styled.p<TextProps>`
  font-size: 16px;
  line-height: 18px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Caption = styled.p<TextProps>`
  font-size: 14px;
  line-height: 18px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
`

const Microscopic = styled.p<TextProps>`
  font-size: 12px;
  line-height: 16px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
  ${paddingMixin};
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
