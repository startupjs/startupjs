import TestThing from './TestThingModel'

export default function (racer) {
  racer.orm('testThings.*', TestThing)
}
