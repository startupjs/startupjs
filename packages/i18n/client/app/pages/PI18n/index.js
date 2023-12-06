/* eslint-disable no-unreachable */
import React from 'react'
import { pug, observer, styl } from 'startupjs'
import {
  Div,
  Loader
} from '@startupjs/ui'
import usePage from './../../../usePage'
import usePageInit from './usePageInit'
import Translations from './Translations'

export default observer(function PI18n () {
  const [displayTranslations] = usePage('displayTranslations')

  return pug`
    PageInit
    if displayTranslations
      Translations
    else
      Div.loader(align='center' vAlign='center' row)
        Loader
  `

  styl`
    .loader
      flex-grow 1
  `
})

const PageInit = observer(() => {
  usePageInit()
  return null
})
