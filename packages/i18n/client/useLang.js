import { $root, useSession } from 'startupjs'
import axios from 'axios'
import { getConfig } from './config'

export default async function useLang () {
  const [lang] = useSession('_session.lang')
  return [lang, setLang]
}

async function setLang (lang) {
  const { langs } = getConfig()

  if (!langs.includes(lang)) {
    throw new Error(
      `[@startupjs/i18n] setLang: ${lang} is not supported`
    )
  }

  await axios.post('/i18n/change-langauge', { lang })
  $root.set('_session.lang', lang)
}
