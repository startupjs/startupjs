const dummyPreventTreeShakingGlobalInit = require('./globalInit')
// TODO: Think how to prevent or error-out when applying the patch twice
//       (for example when there are 2 instances of react-sharedb by mistake)
const dummyPreventTreeShakingPatchRacer = require('./patchRacer')
const batching = require('../batching')
const semaphore = require('./semaphore')
const {
  initLocalCollection,
  clone,
  observablePath
} = require('./util')
const isExtraQuery = require('./isExtraQuery')
const { raw } = require('@nx-js/observer-util')

const batch = batching.batch.bind(batching)
const batchModel = batch

module.exports = {
  batching,
  batch,
  batchModel,
  _semaphore: semaphore,
  initLocalCollection,
  clone,
  _observablePath: observablePath,
  _isExtraQuery: isExtraQuery,
  raw
}

dummyPreventTreeShakingGlobalInit()
dummyPreventTreeShakingPatchRacer()
