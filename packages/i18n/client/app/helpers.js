import { $root } from 'startupjs'
import {
  TRANSLATED_TYPE,
  UNTRANSLATED_TYPE,
  PENDING_FILTER
} from './constants'

export function getTranslationFilter (translationKey, subTranslationKey, lang) {
  const key = `${translationKey}.${subTranslationKey}`
  const $translation = $root.scope(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $draftTranslation = $root.scope(`i18nTranslations.${draftId}`)
  return $draftTranslation.get(key) !== $translation.get(key)
    ? PENDING_FILTER
    : undefined
}

export function getTranslationType (translationKey, subTranslationKey, lang) {
  const key = `${translationKey}.${subTranslationKey}`
  const $translation = $root.scope(`i18nTranslations.${lang}`)
  const draftId = $translation.getDraftId()
  const $draftTranslation = $root.scope(`i18nTranslations.${draftId}`)
  const value = $draftTranslation.get(key)
  return value ? TRANSLATED_TYPE : UNTRANSLATED_TYPE
}
