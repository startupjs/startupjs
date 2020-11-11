import React from 'react'
import { ScrollView, Image } from 'react-native'
import { observer } from 'startupjs'
import { Div, Row, Select } from '@startupjs/ui'
import { BASE_URL } from '@env'
import { useDocsContext } from '../../../../../docsContext'
import { useLang } from '../../../../clientHelpers'
import Options from './Options'
import Docs from './Docs'
import './index.styl'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' }
]

export default observer(function Content ({
  style
}) {
  const [lang, setLang] = useLang()
  // TODO: Change logo image to base64 and pass it through context
  const baseUrl = BASE_URL
  const docs = useDocsContext()

  return pug`
    Div.root
      ScrollView
        Image.logo(source={ uri: baseUrl + '/img/docs.png' })
        Docs(docs=docs lang=lang)
      Row.footer
        Select.lang(
          options=LANGUAGES
          value=lang
          onChange=setLang
          showEmptyValue=false
        )
        Options.options
  `
})
