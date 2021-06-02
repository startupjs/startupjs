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
  const [displayTranslationKeys] = usePage('displayTranslationKeys')

  return pug`
    PageInit
    if displayTranslationKeys
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

const PageInit = observer(() => {
  usePageInit()
  return null
})
