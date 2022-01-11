import { useTokenList } from './useTokenList'

export const useAppVersion = () => {
  const [{ version } = {} as any] = useTokenList()

  return version
    ? `${version.major}.${version.minor}.${version.patch}`
    : undefined
}
