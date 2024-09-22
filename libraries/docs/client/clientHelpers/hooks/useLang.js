import { useSession } from 'startupjs'
import useLocalStorage from './useLocalStorage'
import { DEFAULT_LANGUAGE } from './../../const'

export default function useLang () {
  const [lang, setLang] = useLocalStorage('lang', DEFAULT_LANGUAGE)
  const [sessionLang, $sessionLang] = useSession('lang')
  return [sessionLang || lang, newValue => {
    setLang(newValue)
    $sessionLang.setDiff(newValue)
  }]
}
