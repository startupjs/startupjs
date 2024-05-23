// simple EventEmitter API using native EventTarget

const wrappedListeners = new WeakMap()

export default class EventEmitter extends EventTarget {
  on (type, listener, options = {}) {
    if (typeof options === 'boolean') options = { capture: options }
    let wrappedListener = wrappedListeners.get(listener)
    if (!wrappedListener) {
      wrappedListener = ({ detail: { args = [] } } = {}) => listener(...args)
      wrappedListeners.set(listener, wrappedListener)
    }
    return this.addEventListener(type, wrappedListener, options)
  }

  // passes { once: true } to options
  once (eventName, listener, options = {}) {
    if (typeof options === 'boolean') options = { capture: options }
    return this.on(eventName, listener, { ...options, once: true })
  }

  off (eventName, listener, options = {}) {
    const wrappedListener = wrappedListeners.get(listener)
    if (!wrappedListener) {
      console.warn('[EventEmitter] Listener is not registered.', listener)
      return
    }
    return this.removeEventListener(eventName, wrappedListener, options)
  }

  emit (eventName, ...args) {
    return this.dispatchEvent(new CustomEvent(eventName, { detail: { args } }))
  }
}
