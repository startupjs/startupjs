import { useSession } from 'startupjs'

export default function useProviders () {
  const [providers] = useSession('_2fa.providerIds')
  return providers
}
