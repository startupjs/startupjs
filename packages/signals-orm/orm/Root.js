import getSignal from './getSignal.js'

export const ROOT_FUNCTION = Symbol('root function')
// TODO: in future make a connection spawnable instead of a singleton
// export const CONNECTION = Symbol('sharedb connection, used by sub() function')
export const ROOT = Symbol('root signal')
export const ROOT_ID = Symbol('root signal id. Used for caching')

export const GLOBAL_ROOT_ID = '__global__'

// TODO: create a separate local root for private collections
export function getRootSignal ({
  rootFunction,
  // connection,
  rootId = '_' + createRandomString(8),
  ...options
}) {
  const $root = getSignal(undefined, [], {
    rootId,
    ...options
  })
  $root[ROOT_FUNCTION] ??= rootFunction
  // $root[CONNECTION] ??= connection
  $root[ROOT_ID] ??= rootId
  return $root
}

export function getRoot (signal) {
  if (signal[ROOT]) return signal[ROOT]
  else if (signal[ROOT_ID]) return signal
  else return undefined
}

function createRandomString (length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
