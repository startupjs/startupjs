import getTranslationsModel from './getTranslationsModel.js'
import BaseTranslationModel from './BaseTranslationModel.js'

export default function (racer, i18nPageAccess) {
  if (typeof i18nPageAccess !== 'function') {
    i18nPageAccess = (model, next) => next()
  }

  racer.orm('i18nTranslations', getTranslationsModel(i18nPageAccess))
  racer.orm('i18nTranslations.*', BaseTranslationModel)
}
