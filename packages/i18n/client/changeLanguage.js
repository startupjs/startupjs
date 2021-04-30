import axios from 'axios'
import { getConfig } from './config'

export default async function changeLanguage (lang) {
  const { supportedLangs } = getConfig()
  if (!supportedLangs.includes(lang)) {
    throw new Error(
      `[@startupjs/i18n] changeLanguage: ${lang} is not supported`
    )
  }
  await axios.post('/i18n/change-langauge', { lang })
}
