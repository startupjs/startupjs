import React, { useState, useEffect, useCallback } from 'react'
import { observer, useLocal, useModel } from 'startupjs'
import { Div, Row, Span, TextInput, Icon } from '@startupjs/ui'
import { faUndoAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'
import { useConfig } from './../../../config'
import usePage from './../../../usePage'
import './languages.styl'

export default observer(function Languages ({
  translationKey, subTranslationKey, langs
}) {
  const fullTranslationKey = `${translationKey}.${subTranslationKey}`

  return pug`
    Div.root
      LanguageDefault(fullTranslationKey=fullTranslationKey)
      each lang in langs
        Language(
          key=lang.lang
          lang=lang.lang
          fullTranslationKey=fullTranslationKey
          subTranslationKey=subTranslationKey
        )
  `
})

const LanguageDefault = observer(({ fullTranslationKey }) => {
  const { lang } = useConfig()
  const [value] = usePage(`translations.${fullTranslationKey}`)

  return pug`
    Row.root(vAlign='center')
      Row.info
        Span.lang= lang
      TextInput.input(
        size='s'
        resize
        value=value
        disabled
      )
  `
})

const Language = observer(({ lang, fullTranslationKey }) => {
  const $translation = useModel(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $value = $translation.at(fullTranslationKey)
  const value = $value.get()
  const [draftValue, $draftValue] = useLocal(
    `i18nTranslations.${draftId}.${fullTranslationKey}`
  )

  const [inputValue, setInputValue] = useState(draftValue || '')
  const debounceInputValue = useCallback(
    debounce((text) => {
      if (text) {
        $draftValue.set(text)
      } else {
        $draftValue.del()
      }
    }, 300), [])

  useEffect(() => {
    debounceInputValue(inputValue.trim())
  }, [inputValue])

  const onChangeText = useCallback(setInputValue, [])

  return pug`
    Row.root(vAlign='center')
      Row.info(vAlign='center')
        Span.lang= lang
        Row.pending
          if value !== draftValue
            Div(onPress=() => {
              if (value) {
                $draftValue.set(value)
              } else {
                $draftValue.del()
              }
            })
              Icon.pending-icon(icon=faUndoAlt)
            Div(pushed onPress=() => {
              $value.set(draftValue)
            })
              Icon.pending-icon(icon=faSave)
      TextInput.input(
        size='s'
        resize
        value=inputValue
        onChangeText=onChangeText
      )
  `
})
