import { DEFAULT_OPTIONS } from './helpers'
import metaComponent from './metaComponent'
import makeObserver from './makeObserver'

// TODO: Fix passing options argument in react-native Fast Refresh patch.
//       It has to properly put the closing bracket.
function observer (Component, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options)
  return metaComponent(makeObserver(Component, options), options)
}

observer.__wrapObserverMeta = metaComponent
observer.__makeObserver = makeObserver

export default observer
