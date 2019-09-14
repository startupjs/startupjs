import './globalInit'
import subscribe from './subscribe'
import batching from './batching'
export { default as model, default as $root } from '@startupjs/model'
export { subscribe, batching }
export const batch = batching.batch.bind(batching)
// TODO: DEPRECATED. Add warning to use batch instead
export const batchModel = batch
export { default as _semaphore } from './semaphore'
export { initLocalCollection, clone } from './util'
export {
  subLocal,
  subDoc,
  subQuery,
  subValue,
  subApi
} from './subscriptionTypeFns'
export { observer } from './hooks/observer'
export { default as destroyer } from './hooks/destroyer'
export { useDoc, useQuery, useLocal, useValue, useApi } from './hooks/types'
export {
  emit,
  useModel,
  useOn,
  useEmit,
  ComponentMetaContext,
  useComponentId,
  useNow,
  useQueryIds,
  useLocalDoc,
  useQueryDoc,
  useSession,
  usePage
} from './hooks/helpers'
export { raw } from '@nx-js/observer-util'
