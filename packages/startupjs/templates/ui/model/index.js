import initI18nModel from 'startupjs/i18n/model'

import TestThing from './TestThingModel'

export default function (racer) {
  initI18nModel(racer)
  racer.orm('testThings.*', TestThing)
}
