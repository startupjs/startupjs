import * as React from 'react'
import $root from '@startupjs/model'
import { pipeComponentMeta, DEFAULT_OPTIONS } from './helpers'
import { MetaContext } from '../util'
import { _semaphore as semaphore } from '@startupjs/react-sharedb-util'
import { observable } from '@nx-js/observer-util'

const COLLECTION = '$components'

export default function metaComponent (
  Component,
  options = {}
) {
  const { forwardRef, suspenseProps } = Object.assign({}, DEFAULT_OPTIONS, options)
  if (!(suspenseProps && suspenseProps.fallback)) {
    throw Error('[observer()] You must pass at least a fallback parameter to suspenseProps')
  }

  function ObserverWrapper (props, ref) {
    const componentMeta = React.useMemo(initMeta, [])
    onUnmount(() => destroyMeta(componentMeta))

    return React.createElement(
      MetaContext.Provider,
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

  let memoComponent
  pipeComponentMeta(Component, ObserverWrapper, 'Observer', 'StartupjsWrapperObserver')

  if (forwardRef) {
    memoComponent = React.memo(React.forwardRef(ObserverWrapper))
  } else {
    memoComponent = React.memo(ObserverWrapper)
  }

  pipeComponentMeta(Component, memoComponent)
  return memoComponent
}

function initMeta () {
  const componentId = $root.id()
  const $self = $root
    .context(componentId)
    .scope(`${COLLECTION}.${componentId}`)
  semaphore.allowComponentSetter = true
  $self.set('', observable({}))
  semaphore.allowComponentSetter = false
  return {
    componentId,
    createdAt: Date.now(),
    $self
  }
}

function destroyMeta (meta) {
  semaphore.allowComponentSetter = true
  // Unsubscribe from everything this component was subscribed to
  $root.unload(meta.componentId)
  // Destroy the model of this component and everything within it
  meta.$self.destroy()
  semaphore.allowComponentSetter = false
  for (const key in meta) {
    delete meta[key]
  }
}

function onUnmount (fn) {
  React.useEffect(() => fn, [])
}
