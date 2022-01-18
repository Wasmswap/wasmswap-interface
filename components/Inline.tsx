import { lightTheme, space, styled } from './theme'

export const Inline = styled('div', {
  display: 'flex',
  alignItems: 'center',
  variants: {
    align: {
      'flex-start': {
        justifyContent: 'flex-start',
      },
      'flex-end': {
        justifyContent: 'flex-end',
      },
      center: {
        justifyContent: 'center',
      },
    },
    gap: Object.keys(space).reduce(
      (gapSet, gapKey) => ({
        ...gapSet,
        [gapKey]: {
          columnGap: lightTheme.space[gapKey].value,
        },
      }),
      {}
    ) as Record<keyof typeof space, { rowGap: string }>,
  },
})
