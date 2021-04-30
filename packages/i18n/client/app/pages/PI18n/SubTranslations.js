/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import Languages from './Languages'
import { decodePath } from './../../../../isomorphic'

export default observer(function SubTranslations ({
  translationKey,
  subTranslations
}) {
  return pug`
    Div.root
      each subTranslation in subTranslations
        - const subTranslationKey = subTranslation.key
        Div.translation(key=subTranslationKey)
          Span(bold)= decodePath(subTranslationKey)
          Languages(
            translationKey=translationKey
            subTranslationKey=subTranslationKey
            langs=subTranslation.langs
          )
  `

  styl`
    .translation
      margin-top 2u
  `
})
