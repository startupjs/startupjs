import TestThing from './TestThingModel.js'

export default function (racer) {
  racer.orm('testThings.*', TestThing)
}
