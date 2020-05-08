import useLocalStorage from './useLocalStorage'
import { DEFAULT_LANGUAGE } from './../../const'

export default function useLang () {
  return useLocalStorage('lang', DEFAULT_LANGUAGE)
}
