export function createSpacing({
  steps,
  multiplier = 2,
  baseSize = 16,
}): Record<number, string> {
  return new Array(steps).fill(null).reduce(
    (spacing, _, index) =>
      Object.assign(spacing, {
        [index + 1]: `${((index + 1) * multiplier) / baseSize}rem`,
      }),
    {}
  )
}
