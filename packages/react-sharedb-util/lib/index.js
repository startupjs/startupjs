import dummyPreventTreeShakingGlobalInit from './globalInit.js'
// TODO: Think how to prevent or error-out when applying the patch twice
//       (for example when there are 2 instances of react-sharedb by mistake)
import dummyPreventTreeShakingPatchRacer from './patchRacer.js'
import batching from '../batching.js'

const batch = batching.batch.bind(batching)
const batchModel = batch

export { batching, batch, batchModel }
export { default as _semaphore } from './semaphore.js'
export {
  initLocalCollection,
  clone,
  observablePath as _observablePath
} from './util.js'
export { default as _isExtraQuery } from './isExtraQuery.js'
export { raw } from '@nx-js/observer-util'

dummyPreventTreeShakingGlobalInit()
dummyPreventTreeShakingPatchRacer()
