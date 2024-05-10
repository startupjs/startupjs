// trap render function (functional component) to block observer updates and activate cache
// during synchronous rendering
import { unobserve } from '@nx-js/observer-util'

export default function trapRender ({ render, blockUpdate, cache, reactionRef }) {
  return (...args) => {
    blockUpdate.value = true
    cache.activate()
    let res
    try {
      // destroyer.reset() // TODO: this one is for any destructuring logic which might be needed
      // promiseBatcher.reset() // TODO: this is to support useBatch* hooks
      res = render(...args)
    } catch (err) {
      cache.deactivate()

      // TODO: this might only be needed only if promise in thrown
      //       (check if useUnmount in convertToObserver is called if a regular error is thrown)
      if (reactionRef.current) {
        unobserve(reactionRef.current)
        reactionRef.current = undefined
      }

      if (!err.then) throw err
      // If the Promise was thrown, we catch it before Suspense does.
      // And we run destructors for each hook previous to the one
      // which did throw this Promise.
      // We have to manually do it since the unmount logic is not working
      // for components which were terminated by Suspense as a result of
      // a promise being thrown.
      // const destroy = destroyer.getDestructor()
      // throw err.then(destroy)
      throw err
    }
    cache.deactivate()
    blockUpdate.value = false
    // if (promiseBatcher.isActive()) {
    //   throw Error('[react-sharedb] useBatch* hooks were used without a closing useBatch() call.')
    // }
    return res
  }
}
