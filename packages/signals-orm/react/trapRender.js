// trap render function (functional component) to block observer updates and activate cache
// during synchronous rendering
import { useId } from 'react'
import { unobserve } from '@nx-js/observer-util'
import executionContextTracker from './executionContextTracker.js'

export default function trapRender ({ render, blockUpdate, cache, reactionRef }) {
  return (...args) => {
    const id = useId()
    executionContextTracker._start(id)
    blockUpdate.value = true
    cache.activate()
    try {
      // destroyer.reset() // TODO: this one is for any destructuring logic which might be needed
      // promiseBatcher.reset() // TODO: this is to support useBatch* hooks
      const res = render(...args)
      // if (promiseBatcher.isActive()) {
      //   throw Error('[react-sharedb] useBatch* hooks were used without a closing useBatch() call.')
      // }
      blockUpdate.value = false // TODO: might want to just put it into finally block
      return res
    } catch (err) {
      // TODO: this might only be needed only if promise is thrown
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
    } finally {
      cache.deactivate()
      executionContextTracker._clear()
    }
  }
}
