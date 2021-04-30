/* eslint-disable no-unreachable */
import React from 'react'
import { observer, styl } from 'startupjs'
import {
  Row,
  Loader
} from '@startupjs/ui'
import usePage from './../../../usePage'
import usePageInit from './usePageInit'
import Translations from './Translations'

export default observer(function PI18n () {
  usePageInit()
  const [displayTranslations] = usePage('displayTranslations')

  return pug`
    if displayTranslations
      Translations
    else
      Row.loader(align='center' vAlign='center')
        Loader
  `

  styl`
    .loader
      flex-grow 1
  `
})
