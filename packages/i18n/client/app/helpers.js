import { $root } from 'startupjs'
import {
  TRANSLATED_STATUS,
  UNTRANSLATED_STATUS,
  PENDING_STATE
} from './constants'

export function getTranslationStatus (
  translationFileKey,
  fileTranslationKey,
  lang
) {
  const key = `${translationFileKey}.${fileTranslationKey}`
  const $translation = $root.scope(`i18nTranslations.${lang}`)
  const value = $translation.get(key)
  return value ? TRANSLATED_STATUS : UNTRANSLATED_STATUS
}

export function getTranslationStates (
  translationFileKey,
  fileTranslationKey,
  lang
) {
  const key = `${translationFileKey}.${fileTranslationKey}`
  const $translation = $root.scope(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $draftTranslation = $root.scope(`i18nTranslations.${draftId}`)
  const value = $translation.get(key)
  const draftValue = $draftTranslation.get(key)
  const states = {
    [PENDING_STATE]: value !== draftValue
  }
  return states
}

export function getMetaKey (...args) {
  return args.join('_')
}

export function getLangMeta (translationFileKey, fileTranslationKey, lang) {
  const status = getTranslationStatus(
    translationFileKey,
    fileTranslationKey,
    lang
  )

  const states = getTranslationStates(
    translationFileKey,
    fileTranslationKey,
    lang
  )

  const langMeta = {
    type: 'lang',
    lang,
    translationFileKey,
    fileTranslationKey,
    status,
    states
  }

  return langMeta
}
