import BaseTranslationsModel from './BaseTranslationsModel'
import BaseTranslationModel from './BaseTranslationModel'

export default function (racer) {
  racer.orm('i18nTranslations', BaseTranslationsModel)
  racer.orm('i18nTranslations.*', BaseTranslationModel)
}
