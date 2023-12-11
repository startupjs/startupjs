import initI18nModel from 'startupjs/i18n/model.js'
import initPPlaygroundSignalsModel from '../main/pages/PPlaygroundSignals/model.js'
import TestThing from './TestThingModel.js'

export default function (racer) {
  initI18nModel(racer)
  initPPlaygroundSignalsModel(racer)

  racer.orm('testThings.*', TestThing)
}
