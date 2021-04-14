/* eslint-disable no-unreachable */
import React, { useMemo } from 'react'
import { observer, styl, useSession } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
import Languages from './Languages'

export default observer(function Translations ({
  translationKey: parentTranslationKey,
  ...props
}) {
  const [defaultTranslations] = useSession('_defaultTranslations')
  const translationKeys = useMemo(() => {
    return Object.keys(defaultTranslations[parentTranslationKey])
  }, [])

  return pug`
    Div.root
      each translationKey in translationKeys
        Div.translation(key=translationKey)
          Span(bold)= translationKey
          Languages
  `

  styl`
    .translation
      margin-top 2u
  `
})
