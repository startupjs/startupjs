import { $root, emit, useSession } from 'startupjs'
import axios from 'axios'
import { getConfig } from './config'

export default function useLang () {
  const [lang] = useSession('lang')
  return [lang, setLang]
}

async function setLang (lang) {
  const { langs } = getConfig()

  if (!langs.includes(lang)) {
    throw new Error(
      `[@startupjs/i18n] setLang: ${lang} is not supported`
    )
  }

  await axios.post('/api/i18n/change-language', { lang })
  emit('restart', $root.get('$render.url'))
}
