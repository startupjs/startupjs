import initI18nModel from 'startupjs/i18n/model.js'
import initPPlaygroundSignalsModel from '../main/pages/PPlaygroundSignals/model.js'

export default function (racer) {
  initI18nModel(racer)
  initPPlaygroundSignalsModel(racer)
}
