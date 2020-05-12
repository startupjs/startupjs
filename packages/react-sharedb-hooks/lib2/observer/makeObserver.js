import * as React from 'react'
import { pipeComponentMeta, DEFAULT_OPTIONS } from './helpers'
import { batching } from '@startupjs/react-sharedb-util'
import { observe, unobserve } from '@nx-js/observer-util'
import renderer from './renderer'

export default function makeObserver (baseComponent, options = {}) {
  const { forwardRef } = Object.assign({}, DEFAULT_OPTIONS, options)
  // MAGIC. This fixes hot-reloading. TODO: figure out WHY it fixes it
  const random = Math.random()

  // memo; we are not interested in deep updates
  // in props; we assume that if deep objects are changed,
  // this is in observables, which would have been tracked anyway
  const WrappedComponent = (...args) => {
    // forceUpdate 2.0
    const forceUpdate = useForceUpdate()

    // wrap the baseComponent into an observe decorator once.
    // This way it will track any observable changes and will trigger rerender
    const observedComponent = React.useMemo(() => {
      const blockUpdate = { value: false }
      const update = () => {
        // TODO: Decide whether the check for unmount is needed here
        // Force update unless update is blocked. It's important to block
        // updates caused by rendering
        // (when the sync rendering is in progress)
        if (!blockUpdate.value) forceUpdate()
      }
      const batchedUpdate = () => batching.add(update)
      return observe(renderer(baseComponent, blockUpdate), {
        scheduler: batchedUpdate,
        lazy: true
      })
    }, [random])

    // clean up observer on unmount
    useUnmount(() => unobserve(observedComponent))

    return observedComponent(...args)
  }

  pipeComponentMeta(baseComponent, WrappedComponent)
  return forwardRef
    ? React.forwardRef(WrappedComponent)
    : WrappedComponent
}

function useForceUpdate () {
  const [, setTick] = React.useState()
  return () => {
    setTick(Math.random())
  }
}

// TODO: Might change to just `useEffect` in future. Don't know which one fits here better yet.
function useUnmount (fn) {
  React.useLayoutEffect(() => fn, [])
}
