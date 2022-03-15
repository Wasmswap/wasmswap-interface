import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { lightTheme } from 'theme'

type MediaQueryType = keyof typeof lightTheme.media

export const useMedia = (value: MediaQueryType) => {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(lightTheme.media[value].value).matches
  )

  useEffect(() => {
    const updateIsMatching = () =>
      setMatches(window.matchMedia(lightTheme.media[value].value).matches)

    window.addEventListener('resize', updateIsMatching)

    return () => window.removeEventListener('resize', updateIsMatching)
  }, [value])

  const contextValue = useContext(MediaContext)

  if (contextValue && contextValue === value) {
    return true
  }

  return matches
}

const MediaContext = createContext<MediaQueryType | undefined>(undefined)

export const MediaController = ({
  children,
  media,
}: {
  children: ReactNode
  media: MediaQueryType
}) => {
  return <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
}
