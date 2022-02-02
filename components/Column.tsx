import { lightTheme, space, styled } from './theme'

export const Column = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  variants: {
    align: {
      'flex-start': {
        alignItems: 'flex-start',
      },
      'flex-end': {
        alignItems: 'flex-end',
      },
      center: {
        alignItems: 'center',
      },
    },
    justifyContent: {
      'flex-start': {
        justifyContent: 'flex-start',
      },
      'flex-end': {
        justifyContent: 'flex-end',
      },
      'space-between': {
        justifyContent: 'space-between',
      },
      center: {
        justifyContent: 'center',
      },
    },
    gap: Object.keys(space).reduce(
      (gapSet, gapKey) => ({
        ...gapSet,
        [gapKey]: {
          rowGap: lightTheme.space[gapKey].value,
        },
      }),
      {}
    ) as Record<keyof typeof space, { rowGap: string }>,
  },
})
