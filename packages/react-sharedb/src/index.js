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
  useAsyncDoc,
  useQuery,
  useBatchQuery,
  useAsyncQuery,
  useApi,
  useBatchApi,
  useAsyncApi,
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
  useAsyncQueryIds,
  useLocalDoc,
  useQueryDoc,
  useBatchQueryDoc,
  useAsyncQueryDoc,
  useSession,
  usePage
} from './hooks/helpers'
export {
  ComponentMetaContext,
  useComponentId,
  useNow
} from './hooks/meta'
export { raw } from '@nx-js/observer-util'
