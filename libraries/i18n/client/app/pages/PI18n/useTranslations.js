import axios from 'axios'
import usePage from './../../../usePage'

export default function useTranslations () {
  const [translations, $translations] = usePage('translations')

  if (!translations) {
    throw axios.post('/api/i18n/get-translations').then(({ data }) => {
      $translations.set(data)
    })
  }

  return translations
}
