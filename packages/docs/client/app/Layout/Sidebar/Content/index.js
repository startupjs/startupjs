import { BASE_URL } from '@env'
import React from 'react'
import { observer, $root, emit } from 'startupjs'
import { ScrollView, Image } from 'react-native'
import Options from './Options'
import './index.styl'
import { Div, Row, Select } from '@startupjs/ui'
import { useDocsContext } from '../../../../../docsContext'
import Docs from './Docs'
import { useLang } from '../../../../clientHelpers'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
]

export default observer(function Content ({
  style
}) {
  const [lang, setLang] = useLang()
  if (!lang) return null
  // TODO: Change logo image to base64 and pass it through context
  const baseUrl = BASE_URL
  const docs = useDocsContext()

  function switchLanguage (language) {
    const url = $root.get('$render.url')
    if (lang === language) return
    setLang(language)
    emit('url', url.replace(`/${lang}`, `/${language}`))
  }

  return pug`
    Div.root
      ScrollView.main
        Image.logo(source={ uri: baseUrl + '/img/docs.png' })
        Docs(docs=docs lang=lang)
      Row.footer
        Select.lang(
          options=LANGUAGES
          value=lang
          onChange=switchLanguage
          showEmptyValue=false
        )
        Options.options
  `
})
