export default new class ExecutionContextTracker {
  #contextId
  #hooksCounter

  isActive () {
    return this.#contextId !== undefined
  }

  getComponentId () {
    return this.#contextId
  }

  newHookId () {
    this.incrementHooksCounter()
    const id = `_${this.#contextId}_${this.#hooksCounter}`
    return id
  }

  incrementHooksCounter () {
    if (!this.#contextId) return
    this.#hooksCounter++
  }

  _start (contextId) {
    this.#contextId = contextId
    this.#hooksCounter = -1
  }

  _clear () {
    this.#contextId = undefined
  }
}()
