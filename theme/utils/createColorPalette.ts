import Color from 'color'

export function createColorPalette(
  colors: Record<string, string>
): Record<string, string> {
  const colorPalette = { ...colors }
  const alphaValues = [
    0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
  ]

  Object.keys(colorPalette).forEach((colorName) => {
    alphaValues.forEach((alphaValue) => {
      colorPalette[`${colorName}${parseInt(String(alphaValue * 100), 10)}`] =
        Color(colorPalette[colorName]).alpha(alphaValue).rgb().string()
    })
  })

  return colorPalette
}
