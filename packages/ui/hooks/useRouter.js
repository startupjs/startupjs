// this is a universal router hook with a universal interface
// to use in both react-router (pure RN) and expo-router (Expo) projects.
// This is a default implementation for pure RN which uses react-router (our 'startupjs/app' package)
// Expo implementation is in the .expo.js file and uses expo-router.
// The API emulates the expo-router API.
import { useCallback } from 'react'
import { useHistory } from 'react-router'

export default function useRouter () {
  const history = useHistory()
  return {
    replace: history.replace,
    push: history.push,
    back: history.goBack,
    navigate: history.push, // on expo-router this automatically decides to use push or replace
    canGoBack: useCallback(() => Boolean(history.index), [history])
  }
}
