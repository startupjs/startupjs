import { destroyer, promiseBatcher } from '../util'

export default function renderer (baseComponent, blockUpdate) {
  return (...args) => {
    blockUpdate.value = true
    let res
    try {
      destroyer.reset()
      promiseBatcher.reset()
      res = baseComponent(...args)
    } catch (err) {
      if (!err.then) throw err
      // If the Promise was thrown, we catch it before Suspense does.
      // And we run destructors for each hook previous to the one
      // which did throw this Promise.
      // We have to manually do it since the unmount logic is not working
      // for components which were terminated by Suspense as a result of
      // a promise being thrown.
      const destroy = destroyer.getDestructor()
      throw err.then(destroy)
    }
    blockUpdate.value = false
    if (promiseBatcher.isActive()) {
      throw Error('[react-sharedb] useBatch* hooks were used without a closing useBatch() call.')
    }
    return res
  }
}
