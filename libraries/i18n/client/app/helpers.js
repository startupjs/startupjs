import { $root } from 'startupjs'
import {
  TRANSLATED_STATE,
  UNTRANSLATED_STATE,
  PENDING_STATUS
} from './constants'
import usePage from './../usePage'

export function getTranslationState (
  translationFileKey,
  fileTranslationKey,
  lang
) {
  const key = `${translationFileKey}.${fileTranslationKey}`
  const $translation = $root.scope(`i18nTranslations.${lang}`)
  const value = $translation.get(key)
  return value ? TRANSLATED_STATE : UNTRANSLATED_STATE
}

export function getTranslationStatuses (
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
  const statuses = {
    [PENDING_STATUS]: value !== draftValue
  }
  return statuses
}

export function getMetaKey (...args) {
  return args.join('__i18n__')
}

export function getLangMeta (translationFileKey, fileTranslationKey, lang) {
  const state = getTranslationState(
    translationFileKey,
    fileTranslationKey,
    lang
  )

  const statuses = getTranslationStatuses(
    translationFileKey,
    fileTranslationKey,
    lang
  )

  const langMeta = {
    translationFileKey,
    fileTranslationKey,
    lang,
    state,
    statuses
  }

  return langMeta
}

export function useForceUpdate (key) {
  const [value = 0, $value] = usePage(key)
  return [value, () => $value.set(Math.random())]
}

export function useForceUpdatePageInit () {
  const [value = false, $value] = usePage('forceUpdatePageInit')
  return [value, (newValue) => $value.set(newValue)]
}

export function useForceUpdateFiltersCounters () {
  return useForceUpdate('forceUpdateFiltersCounters')
}
