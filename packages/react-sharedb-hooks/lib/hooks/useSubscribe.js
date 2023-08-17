import React, { useRef } from 'react'
import { resetCatcher, getAsync } from './asyncCatcher.js'
import { observer } from './observer.js'

export function useSubscribe$ (fn) {
  const lastSyncedProps = useRef({})
  resetCatcher()
  const subscriptionProps = fn()
  if (!getAsync()) lastSyncedProps.current = subscriptionProps
  return lastSyncedProps.current
}

export function subscribe$ (SubscriptionComponent) {
  return function wrapIntoSubscription (Component, options) {
    const ObservableComponent = observer.__wrapObserverMeta(observer.__makeObserver(Component, options))

    function FullSubscriptionComponent (componentProps) {
      // TODO: when the re-subscription waterfall starts, wait until it fully ends.
      //       In order to achieve this we set a special "async" when async init is active
      //       which shows whether any item has an active re-subscription.
      const lastSyncedProps = useRef({})
      resetCatcher()
      const subscriptionProps = SubscriptionComponent(componentProps)
      if (!getAsync()) lastSyncedProps.current = subscriptionProps
      return React.createElement(ObservableComponent, Object.assign({}, componentProps, lastSyncedProps.current))
    }
    const ObservableFullSubscriptionComponent = observer.__wrapObserverMeta(observer.__makeObserver(FullSubscriptionComponent))

    function WrappedComponent (componentProps) {
      return React.createElement(ObservableFullSubscriptionComponent, componentProps)
    }
    return React.memo(WrappedComponent)
  }
}
