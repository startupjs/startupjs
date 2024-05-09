import { useMemo, forwardRef as _forwardRef, memo, createElement as el, Suspense } from 'react'
import { createCaches } from '@startupjs/cache'
import { __increment, __decrement } from '@startupjs/debug'
import { pipeComponentMeta, pipeComponentDisplayName, ComponentMetaContext, useUnmount } from './helpers.js'

export default function wrapIntoSuspense (
  ObservedComponent
) {
  const { forwardRef, suspenseProps } = ObservedComponent.__observerOptions
  if (!(suspenseProps && suspenseProps.fallback)) {
    throw Error(
      '[observer()] You must pass at least ' +
      'a fallback parameter to suspenseProps'
    )
  }

  let SuspenseWrapper = (props, ref) => {
    const cache = useMemo(() => {
      __increment('ObserverWrapper.cache')
      return createCaches(['styles', 'model'])
    }, [])
    // TODO: using useState instead of useMemo will keep this intact during Fast Refresh
    //       Research if we can change it to use it.
    // const [componentMeta] = React.useState({
    //   componentId: $root.id(),
    //   createdAt: Date.now(),
    //   cache
    // })
    const componentMeta = useMemo(function () {
      return {
        // componentId: $root.id(), // TODO: implement creating a unique component guid here (if it's needed anymore)
        createdAt: Date.now(),
        cache
      }
    }, [])

    useUnmount(() => {
      __decrement('ObserverWrapper.cache')
      cache.clear()
    })

    if (forwardRef) props = { ...props, ref }

    return (
      el(ComponentMetaContext.Provider, { value: componentMeta },
        el(Suspense, suspenseProps,
          el(ObservedComponent, props)
        )
      )
    )
  }

  // pipe only displayName because forwardRef render function
  // do not support propTypes or defaultProps
  pipeComponentDisplayName(ObservedComponent, SuspenseWrapper, 'StartupjsObserverWrapper')

  if (forwardRef) SuspenseWrapper = _forwardRef(SuspenseWrapper)
  SuspenseWrapper = memo(SuspenseWrapper)

  pipeComponentMeta(ObservedComponent, SuspenseWrapper)

  return SuspenseWrapper
}
