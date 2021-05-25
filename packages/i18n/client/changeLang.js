import axios from 'axios'
import { getConfig } from './config'

export default async function changeLang (lang) {
  const { langs } = getConfig()

  if (!langs.includes(lang)) {
    throw new Error(
      `[@startupjs/i18n] changeLang: ${lang} is not supported`
    )
  }

  await axios.post('/i18n/change-langauge', { lang })
}
