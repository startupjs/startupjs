// ref: https://github.com/mobxjs/mobx-react-lite/blob/master/src/observer.ts
import * as React from 'react'
import { observe, unobserve } from '@nx-js/observer-util'
import { batching } from '@startupjs/react-sharedb-util'
import destroyer from './destroyer.js'
import promiseBatcher from './promiseBatcher.js'
import $root from '@startupjs/model'
import { ComponentMetaContext } from './meta.js'

const DEFAULT_OPTIONS = {
  forwardRef: false,
  suspenseProps: {
    fallback: React.createElement(NullComponent, null, null)
  }
}

// TODO: Fix passing options argument in react-native Fast Refresh patch.
//       It has to properly put the closing bracket.
function observer (Component, options) {
  const _options = Object.assign({}, DEFAULT_OPTIONS, options)
  return wrapObserverMeta(makeObserver(Component, _options), _options)
}

observer.__wrapObserverMeta = wrapObserverMeta
observer.__makeObserver = makeObserver

export { observer }

function pipeComponentDisplayName (SourceComponent, TargetComponent, suffix = '', defaultName = 'StartupjsWrapper') {
  const displayName = SourceComponent.displayName || SourceComponent.name

  if (!TargetComponent.displayName) {
    TargetComponent.displayName = displayName ? (displayName + suffix) : defaultName
  }
}

function pipeComponentMeta (SourceComponent, TargetComponent, suffix = '', defaultName = 'StartupjsWrapper') {
  pipeComponentDisplayName(SourceComponent, TargetComponent, suffix, defaultName)

  if (!TargetComponent.propTypes && SourceComponent.propTypes) {
    TargetComponent.propTypes = SourceComponent.propTypes
  }
  if (!TargetComponent.defaultProps && SourceComponent.defaultProps) {
    TargetComponent.defaultProps = SourceComponent.defaultProps
  }
  return TargetComponent
}

function makeObserver (baseComponent, options = {}) {
  const { forwardRef } = Object.assign({}, DEFAULT_OPTIONS, options)
  // MAGIC. This fixes hot-reloading. TODO: figure out WHY it fixes it
  const random = Math.random()

  // memo; we are not intested in deep updates
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
        // (when the sync rendening is in progress)
        if (!blockUpdate.value) forceUpdate()
      }
      const batchedUpdate = () => batching.add(update)
      return observe(wrapBaseComponent(baseComponent, blockUpdate), {
        scheduler: batchedUpdate,
        lazy: true
      })
    }, [random])

    // clean up observer on unmount
    useUnmount(() => unobserve(observedComponent))

    return observedComponent(...args)
  }

  const Component = forwardRef
    ? React.forwardRef(WrappedComponent)
    : WrappedComponent

  pipeComponentMeta(baseComponent, Component)

  return Component
}

function wrapObserverMeta (
  Component,
  options = {}
) {
  const { forwardRef, suspenseProps } = Object.assign({}, DEFAULT_OPTIONS, options)
  if (!(suspenseProps && suspenseProps.fallback)) {
    throw Error(
      '[observer()] You must pass at least ' +
      'a fallback parameter to suspenseProps'
    )
  }

  function ObserverWrapper (props, ref) {
    var componentMeta = React.useMemo(function () {
      return {
        componentId: $root.id(),
        createdAt: Date.now()
      }
    }, [])
    return React.createElement(
      ComponentMetaContext.Provider,
      { value: componentMeta },
      React.createElement(
        React.Suspense,
        suspenseProps,
        forwardRef
          ? React.createElement(Component, Object.assign({}, props, { ref }))
          : React.createElement(Component, props)
      )
    )
  }

  // pipe only displayName because forwardRef render function
  // do not support propTypes or defaultProps
  pipeComponentDisplayName(Component, ObserverWrapper, 'StartupjsObserverWrapper')

  const memoComponent = React.memo(
    forwardRef
      ? React.forwardRef(ObserverWrapper)
      : ObserverWrapper
  )

  pipeComponentMeta(Component, memoComponent)

  return memoComponent
}

function wrapBaseComponent (baseComponent, blockUpdate) {
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

function NullComponent () {
  return null
}
