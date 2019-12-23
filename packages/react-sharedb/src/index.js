import './globalInit'
import subscribe from './subscribe'
import batching, { batch, batchModel } from './batching'
export { default as model, default as $root } from '@startupjs/model'
export { subscribe, batching, batch, batchModel }
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
export {
  useDoc,
  useBatchDoc,
  useOptionalDoc,
  useQuery,
  useBatchQuery,
  useOptionalQuery,
  useApi,
  useBatchApi,
  useOptionalApi,
  useLocal,
  useValue,
  useBatch
} from './hooks/types'
export {
  emit,
  useModel,
  useOn,
  useEmit,
  useQueryIds,
  useBatchQueryIds,
  useOptionalQueryIds,
  useLocalDoc,
  useQueryDoc,
  useBatchQueryDoc,
  useOptionalQueryDoc,
  useSession,
  usePage
} from './hooks/helpers'
export {
  ComponentMetaContext,
  useComponentId,
  useNow
} from './hooks/meta'
export { raw } from '@nx-js/observer-util'
