import initI18nModel from 'startupjs/i18n/model.js'

import TestThing from './TestThingModel.js'

export default function (racer) {
  initI18nModel(racer)
  racer.orm('testThings.*', TestThing)
}
