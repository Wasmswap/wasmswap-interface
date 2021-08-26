import React, { HTMLProps } from 'react'
import styled from 'styled-components'
import { colorTokens } from '../util/constants'

const fontWeightTokens = {
  bold: 700,
  normal: 600,
  light: 400,
}

type TextProps = {
  type?: 'heading' | 'body' | 'caption'
  color?: keyof typeof colorTokens
  variant?: keyof typeof fontWeightTokens
}

const colorTokenSelector = (props: TextProps) =>
  colorTokens[props.color] || colorTokens.black
const fontWeightSelector = (props: TextProps) =>
  fontWeightTokens[props.variant] || fontWeightTokens.normal

const Heading = styled.p<TextProps>`
  font-size: 20px;
  line-height: 27px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
`

const Paragraph = styled.p<TextProps>`
  font-size: 18px;
  line-height: 24px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
`

const Caption = styled.p<TextProps>`
  font-size: 14px;
  line-height: 18px;
  color: ${colorTokenSelector};
  font-weight: ${fontWeightSelector};
`

const map = {
  body: Paragraph,
  caption: Caption,
  heading: Heading,
}

export const Text = ({
  type = 'body',
  ...props
}: TextProps & HTMLProps<HTMLParagraphElement>) => {
  const TextComponent = map[type] || Paragraph
  return <TextComponent {...props} />
}
