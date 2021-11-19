import model from '@startupjs/model'
import { initLocalCollection } from './util.js'

const OBSERVABLE_COLLECTIONS = [
  '$connection',
  '$queries',
  '$components',
  '$hooks',
  '$subs',
  '$render',
  '$system',
  '_page',
  '_session'
]

// Export a dummy function to prevent tree shaking from getting rid of this module
export default function dummyNoTreeShaking () {}

if (model) {
  init()
} else {
  console.warn(
    'react-sharedb (@subscribe) can only be used on the client. Ignoring server initialization.'
  )
}

function init () {
  for (const collection of OBSERVABLE_COLLECTIONS) {
    initLocalCollection(collection)
  }
}
