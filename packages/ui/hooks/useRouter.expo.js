import { useRouter as _useRouter } from 'expo-router'

export default function useRouter () {
  const { replace, push, back, canGoBack, navigate } = _useRouter()
  return { replace, push, back, canGoBack, navigate }
}
