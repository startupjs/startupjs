/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Div, Row, Span, TextInput } from '@startupjs/ui'
import { useConfig } from './../../../config'

export default observer(function Languages () {
  const { defaultLang, supportedLangs } = useConfig()

  return pug`
    Div.root
      Language(lang=defaultLang edit=false)
      each lang in supportedLangs
        Language(key=lang lang=lang)
  `
})

const Language = observer(function Language ({
  lang,
  edit = true
}) {
  return pug`
    Row.root(vAlign='center')
      Span.text= lang
      TextInput.input(
        size='s'
        resize
        disabled=!edit
      )
  `

  styl`
    .root
      padding-top 1u
      padding-bottom @padding-top
    .text
      min-width 5u
    .input
      flex-grow 1
      margin-left 2u
  `
})

// -   value=defaultTranslations[parentTranslationKey][translationKey]
