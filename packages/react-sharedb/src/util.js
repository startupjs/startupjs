import model from '@startupjs/model'
import { observable, isObservable } from '@nx-js/observer-util'
import get from 'lodash/get'
import semaphore from './semaphore'

export function observablePath (path) {
  let segments = model._splitPath(path)
  let originalSegments = model._dereference(segments, true)
  let parentSegments = originalSegments.slice(0, -1)
  let leafSegment = originalSegments[originalSegments.length - 1]
  let result = get(model.data, originalSegments)
  if (typeof result === 'object' && result !== null && !isObservable(result)) {
    get(model.data, parentSegments)[leafSegment] = observable(result)
  }
}

export function initLocalCollection (collection) {
  semaphore.ignoreCollectionObservableWarning = true
  semaphore.allowComponentSetter = true
  model.set(`${collection}.__OBSERVABLE`, true)
  semaphore.allowComponentSetter = false
  semaphore.ignoreCollectionObservableWarning = false
  model.data[collection] = observable(model.data[collection])
}

export function clone (data) {
  let stringified = JSON.stringify(data)
  if (!stringified) return undefined
  return JSON.parse(stringified)
}
