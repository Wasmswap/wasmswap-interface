import { lightTheme } from 'components/theme'
import { useEffect, useState } from 'react'

const mediaQueries = lightTheme.media

export const useMedia = (value: keyof typeof mediaQueries) => {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(mediaQueries[value].value).matches
  )

  useEffect(() => {
    const updateIsMatching = () =>
      setMatches(window.matchMedia(mediaQueries[value].value).matches)

    window.addEventListener('resize', updateIsMatching)
    return () => window.removeEventListener('resize', updateIsMatching)
  }, [value])

  return matches
}
