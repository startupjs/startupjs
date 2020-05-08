import { BASE_URL } from '@env'
import React from 'react'
import { observer, $root, emit } from 'startupjs'
import { ScrollView, Image } from 'react-native'
import Options from './Options'
import './index.styl'
import { Div, Button, Row } from '@startupjs/ui'
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
  // TODO: Change logo image to base64 and pass it through context
  const baseUrl = BASE_URL
  const docs = useDocsContext()
  const [lang, setLang] = useLang()

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
        Docs(docs=docs)
      Row.lang(align='center')
        each LANGUAGE in LANGUAGES
          - const { value, label } = LANGUAGE
          Button(
            key=value
            size='s'
            variant='text'
            color=lang === value ? 'primary' : undefined
            onPress=switchLanguage.bind(null, value)
          )= label
      Options
  `
})
