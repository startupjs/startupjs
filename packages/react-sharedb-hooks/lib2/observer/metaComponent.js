import * as React from 'react'
import { pipeComponentMeta, DEFAULT_OPTIONS } from './helpers'
import { MetaContext } from '../util'
import Meta from './Meta'

export default function metaComponent (
  Component,
  options = {}
) {
  const { forwardRef, suspenseProps } = Object.assign({}, DEFAULT_OPTIONS, options)
  if (!(suspenseProps && suspenseProps.fallback)) {
    throw Error('[observer()] You must pass at least a fallback parameter to suspenseProps')
  }

  function ObserverWrapper (props, ref) {
    const meta = React.useMemo(() => new Meta(), [])
    onUnmount(meta.destroy)

    return React.createElement(
      MetaContext.Provider,
      { value: meta },
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

function onUnmount (fn) {
  React.useEffect(() => fn, [])
}
