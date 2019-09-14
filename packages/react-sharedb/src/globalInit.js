import model from '@startupjs/model'
import { initLocalCollection } from './util'

const OBSERVABLE_COLLECTIONS = [
  '$connection',
  '$queries',
  '$components',
  '$hooks',
  '$subs',
  '_page',
  '_session'
]

if (model) {
  init()
} else {
  console.warn(
    'react-sharedb (@subscribe) can only be used on the client. Ignoring server initialization.'
  )
}

function init () {
  for (let collection of OBSERVABLE_COLLECTIONS) {
    initLocalCollection(collection)
  }
}
