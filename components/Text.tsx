import React, { ForwardedRef, forwardRef, HTMLProps } from 'react'
import styled, { css } from 'styled-components'
import { colorTokens } from '../util/constants'

const fontWeightTokens = {
  bold: 700,
  normal: 600,
  light: 400,
}

type TextProps = {
  type?: 'heading' | 'title' | 'body' | 'subtitle' | 'caption'
  color?: keyof typeof colorTokens
  variant?: keyof typeof fontWeightTokens
  paddingTop?: string
  paddingBottom?: string
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
  ${(p) => (p.paddingTop ? `padding-top: ${p.paddingTop}` : '')};
  ${(p) => (p.paddingBottom ? `padding-bottom: ${p.paddingBottom}` : '')};
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

const map = {
  body: Paragraph,
  caption: Caption,
  heading: Heading,
  title: Title,
  subtitle: Subtitle,
}

const TextComponent = (
  { type = 'body', ...props }: TextProps & HTMLProps<HTMLParagraphElement>,
  ref: ForwardedRef<any>
) => {
  const TextComponent = map[type] || Paragraph
  return <TextComponent ref={ref} {...props} />
}

export const Text = forwardRef(TextComponent) as typeof TextComponent
