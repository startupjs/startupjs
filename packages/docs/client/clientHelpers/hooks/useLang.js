import useLocalStorage from './useLocalStorage'

const DEFAULT_LANGUAGE = 'en'

export default function useLang () {
  return useLocalStorage('lang', DEFAULT_LANGUAGE)
}
