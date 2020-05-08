export default class Base {
  constructor (model, key, params) {
    this.key = key
    this.params = params
    this.model = model
  }

  refModel () {}

  unrefModel () {}

  destroy () {
    this.cancel()
    delete this.model
    delete this.params
    delete this.key
  }

  // Cancel initialization process
  cancel () {
    // If model doesn't exist, it means that the item was already destroyed,
    // so no need to cancel
    if (!this.cancelled) this.cancelled = true
  }
}
