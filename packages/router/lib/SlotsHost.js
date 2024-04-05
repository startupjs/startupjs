import { createContext, createElement as el, useMemo, useContext, useEffect, memo } from 'react'

export default memo(function SlotsHost ({ children }) {
  const slotsManager = useMemo(() => new SlotsManager(), [])
  useEffect(() => {
    return () => slotsManager.destroy()
  }, [])
  return (
    el(SlotsManagerContext.Provider, { value: slotsManager },
      children
    )
  )
})

export const SlotsManagerContext = createContext()

export function useSlot (name) {
  const slotsManager = useContext(SlotsManagerContext)
  if (!(slotsManager?.alive)) return
  return slotsManager.getOrCreateSlot(name)
}

class SlotsManager {
  alive = true
  slots = {}

  getOrCreateSlot (name) {
    if (!this.slots[name]) this.slots[name] = new Slot(name)
    return this.slots[name]
  }

  destroy () {
    this.alive = undefined
    for (const name in this.slots) {
      this.slots[name].destroy()
      delete this.slots[name]
    }
  }
}

class Slot {
  #alive = true
  #hasOverride
  #override
  #rerender
  #waitingForRerenderTimeout

  constructor (name) {
    this.name = name
  }

  isAlive () {
    return this.#alive
  }

  render (defaultChildren) {
    if (!(this.#alive && this.#hasOverride)) return defaultChildren
    return this.#override
  }

  renderOverride (children) {
    if (!this.#alive) return
    this.setOverride(children)
    if (!this.#rerender) return // no need to rerender if SlotProvider doesn't exist yet
    // simple debounce logic to avoid multiple rerenders in a row
    if (this.#waitingForRerenderTimeout) clearTimeout(this.#waitingForRerenderTimeout)
    this.#waitingForRerenderTimeout = setTimeout(() => {
      this.#waitingForRerenderTimeout = undefined
      this.#rerender?.()
    }, 0)
  }

  setRerender (rerender) {
    if (!this.#alive) return
    this.#rerender = rerender
  }

  setOverride (children) {
    if (!this.#alive) return
    this.#override = children
    this.#hasOverride = true
  }

  clearRerender () {
    if (!this.#alive) return
    this.#rerender = undefined
  }

  clearOverride () {
    if (!this.#alive) return
    this.#hasOverride = undefined
    this.#override = undefined
  }

  destroy () {
    if (!this.#alive) return
    this.#alive = undefined
    this.#hasOverride = undefined
    this.#override = undefined
    this.#rerender = undefined
    if (this.#waitingForRerenderTimeout) clearTimeout(this.#waitingForRerenderTimeout)
    this.#waitingForRerenderTimeout = undefined
  }
}
