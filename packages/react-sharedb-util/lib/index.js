import dummyPreventTreeShakingGlobalInit from './globalInit'
// TODO: Think how to prevent or error-out when applying the patch twice
//       (for example when there are 2 instances of react-sharedb by mistake)
import dummyPreventTreeShakingPatchRacer from './patchRacer'
import batching from '../batching'

const batch = batching.batch.bind(batching)
const batchModel = batch

export { batching, batch, batchModel }
export { default as _semaphore } from './semaphore'
export {
  initLocalCollection,
  clone,
  observablePath as _observablePath
} from './util'
export { default as _isExtraQuery } from './isExtraQuery'
export { raw } from '@nx-js/observer-util'

dummyPreventTreeShakingGlobalInit()
dummyPreventTreeShakingPatchRacer()
