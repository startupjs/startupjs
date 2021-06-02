import React, { useEffect, useCallback } from 'react'
import { observer, useLocal, useModel } from 'startupjs'
import { Div, Row, Span, TextInput, Icon } from '@startupjs/ui'
import { faUndoAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'
import { getLangMeta } from './../../helpers'
import { FILTERS_META, PENDING_STATE } from './../../constants'
import usePage from './../../../usePage'
import './languages.styl'

export default observer(function Lang ({ style, _key }) {
  const [meta, $meta] = usePage(`translationsMeta.${_key}`)
  const { translationFileKey, fileTranslationKey, lang } = meta
  const fullTranslationKey = `${translationFileKey}.${fileTranslationKey}`

  const $translation = useModel(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $value = $translation.at(fullTranslationKey)
  const value = $value.get()
  const [draftValue, $draftValue] = useLocal(
    `i18nTranslations.${draftId}.${fullTranslationKey}`
  )

  function updateMeta () {
    const langMeta = getLangMeta(translationFileKey, fileTranslationKey, lang)
    $meta.setDiffDeep(langMeta)
  }

  const debounceUpdateMeta = useCallback(
    debounce(updateMeta, 300), [])

  useEffect(() => {
    debounceUpdateMeta()
  }, [draftValue])

  const onChangeText = useCallback((text) => {
    if (text) {
      $draftValue.set(text)
    } else {
      $draftValue.del()
    }
  }, [])

  return pug`
    Row.root(style=style vAlign='center')
      Row.info(align='between' vAlign='center')
        Row
          Div.status
            - const statusMeta = FILTERS_META[meta.status]
            Icon(style=statusMeta.style icon=statusMeta.icon)
          if meta.states[PENDING_STATE]
            Row.pending
              Div(onPress=() => {
                onChangeText(value)
              })
                Icon.pending-icon(icon=faUndoAlt)
              Div(pushed onPress=() => {
                $value.set(draftValue)
                updateMeta()
              })
                Icon.pending-icon(icon=faSave)
        Span.lang= lang
      TextInput.input(
        size='s'
        resize
        value=draftValue
        onChangeText=onChangeText
      )
  `
})
