import React, { useCallback } from 'react'
import { observer, useLocal, useDidUpdate, useModel } from 'startupjs'
import { Div, Row, Span, TextInput, Icon } from '@startupjs/ui'
import { faUndoAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import debounce from 'lodash/debounce'
import { getLangMeta, useForceUpdateFiltersCounters } from './../../helpers'
import { FILTERS_META, PENDING_STATUS } from './../../constants'
import usePage from './../../../usePage'
import './languages.styl'

export default observer(function Lang ({ style, meta }) {
  const [langMeta, $langMeta] = usePage(`langsMeta.${meta.key}`)
  const { translationFileKey, fileTranslationKey, lang } = langMeta
  const fullTranslationKey = `${translationFileKey}.${fileTranslationKey}`
  const [, setForceUpdateFiltersCounters] = useForceUpdateFiltersCounters()
  const $translation = useModel(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $value = $translation.at(fullTranslationKey)
  const value = $value.get()
  const [draftValue, $draftValue] = useLocal(
    `i18nTranslations.${draftId}.${fullTranslationKey}`
  )

  async function updateMeta () {
    const langMeta = getLangMeta(translationFileKey, fileTranslationKey, lang)
    $langMeta.setDiffDeep(langMeta)
    // we want to rerender lang row before recalculate counters
    setTimeout(() => {
      setForceUpdateFiltersCounters()
    }, 0)
  }

  const debounceUpdateMeta = useCallback(
    debounce(updateMeta, 300), [])

  useDidUpdate(() => {
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
      Row.info(vAlign='center')
        Row
          Div
            - const statusMeta = FILTERS_META[langMeta.state]
            Icon(style=statusMeta.style icon=statusMeta.icon)
          if langMeta.statuses[PENDING_STATUS]
            Row.pending
              Div(onPress=() => {
                onChangeText(value)
              })
                Icon.pending-icon(icon=faUndoAlt)
              Div(pushed onPress=() => {
                if (draftValue) {
                  $value.set(draftValue)
                } else {
                  $value.del()
                }
                updateMeta()
              })
                Icon.pending-icon(icon=faSave)
        Span.lang= lang
        // TODO
        // input multiline
      TextInput.input(
        size='s'
        resize
        value=draftValue
        onChangeText=onChangeText
      )
  `
})
