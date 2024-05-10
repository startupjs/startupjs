// TODO: rewrite to use useSyncExternalStore like in mobx. This will also help with handling Suspense abandonment better
//       to cleanup the observer() reaction when the component is unmounted or was abandoned and unmounts will never trigger.
//       ref: https://github.com/mobxjs/mobx/blob/94bc4997c14152ff5aefcaac64d982d5c21ba51a/packages/mobx-react-lite/src/useObserver.ts
import { createElement as el, forwardRef as _forwardRef, useCallback, useState, useMemo } from 'react'
import _throttle from 'lodash/throttle.js'
import { observe, unobserve } from '@nx-js/observer-util'
import { pipeComponentMeta, useCache, useUnmount } from './helpers.js'
import trapRender from './trapRender.js'

const DEFAULT_THROTTLE_TIMEOUT = 100

export default function convertToObserver (BaseComponent, options = {}) {
  options = { ...DEFAULT_OPTIONS, ...options }
  const { forwardRef } = options
  // MAGIC. This fixes hot-reloading. TODO: figure out WHY it fixes it
  const random = Math.random()

  // memo; we are not intested in deep updates
  // in props; we assume that if deep objects are changed,
  // this is in observables, which would have been tracked anyway
  let Component = (...args) => {
    // forceUpdate 2.0
    const forceUpdate = useForceUpdate(options.throttle)
    const cache = useCache(options.cache != null ? options.cache : true)

    // wrap the BaseComponent into an observe decorator once.
    // This way it will track any observable changes and will trigger rerender
    const reactionRef = useMemo(() => ({}), [])
    const observedRender = useMemo(() => {
      const blockUpdate = { value: false }
      const update = () => {
        // TODO: Decide whether the check for unmount is needed here
        // Force update unless update is blocked. It's important to block
        // updates caused by rendering
        // (when the sync rendening is in progress)
        if (!blockUpdate.value) forceUpdate()
      }
      const trappedRender = trapRender({ render: BaseComponent, blockUpdate, cache, reactionRef })
      return observe(trappedRender, {
        scheduler: update,
        lazy: true
      })
    }, [random])

    if (reactionRef.current !== observedRender) reactionRef.current = observedRender

    // clean up observer on unmount
    useUnmount(() => {
      // TODO: this does not execute the same amount of times as observe() does,
      //       probably because of throw's of the async hooks.
      //       So there probably are memory leaks here. Research this.
      if (observedRender.current) {
        unobserve(observedRender.current)
        observedRender.current = undefined
      }
    })

    return observedRender(...args)
  }

  if (forwardRef) Component = _forwardRef(Component)
  pipeComponentMeta(BaseComponent, Component)

  Component.__observerOptions = options

  return Component
}

const DEFAULT_OPTIONS = {
  forwardRef: false,
  suspenseProps: {
    fallback: el(NullComponent, null, null)
  }
}

function NullComponent () {
  return null
}

function useForceUpdate (throttle) {
  const [, setTick] = useState()
  if (throttle) {
    const timeout = typeof (throttle) === 'number' ? +throttle : DEFAULT_THROTTLE_TIMEOUT
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useCallback(
      _throttle(() => {
        setTick(Math.random())
      }, timeout)
      , [])
  } else {
    return () => setTick(Math.random())
  }
}
