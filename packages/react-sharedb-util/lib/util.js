import model from '@startupjs/model'
import { observable, isObservable } from '@nx-js/observer-util'
import get from 'lodash/get.js'
import semaphore from './semaphore.js'

export function observablePath (path) {
  const segments = model._splitPath(path)
  const originalSegments = model._dereference(segments, true)
  const parentSegments = originalSegments.slice(0, -1)
  const leafSegment = originalSegments[originalSegments.length - 1]
  const result = get(model.data, originalSegments)
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
  const stringified = JSON.stringify(data)
  if (!stringified) return undefined
  return JSON.parse(stringified)
}
