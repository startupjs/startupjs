import convertToObserver from './convertToObserver.js'
import wrapIntoSuspense from './wrapIntoSuspense.js'

function observer (Component, options) {
  return wrapIntoSuspense(convertToObserver(Component, options))
}
observer.__wrapObserverMeta = wrapIntoSuspense
observer.__makeObserver = convertToObserver
export default observer
