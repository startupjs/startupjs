import React from 'react'
import { ScrollView, Image } from 'react-native'
import { pug, observer } from 'startupjs'
import { Div, Select } from '@startupjs/ui'
import { BASE_URL } from '@env'
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

  return pug`
    Div.root
      ScrollView
        Image.logo(testID='logo' source={ uri: baseUrl + '/img/docs.png' })
        Docs
      Div.footer(row)
        Select.lang(
          testID='languagesSelect'
          options=LANGUAGES
          value=lang
          onChange=setLang
          showEmptyValue=false
        )
        Options.options
  `
})
