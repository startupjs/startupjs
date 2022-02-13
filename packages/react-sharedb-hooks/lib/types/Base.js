export default class Base {
  constructor ($component, hookId, params) {
    this.hookId = hookId
    this.params = params
    this.$component = $component
    this.$root = $component.root
  }

  refModel () {}

  unrefModel () {}

  destroy () {
    this.cancel()
    delete this.$root
    delete this.$component
    delete this.params
    delete this.hookId
  }

  // Cancel initialization process
  cancel () {
    // If model doesn't exist, it means that the item was already destroyed,
    // so no need to cancel
    if (!this.cancelled) this.cancelled = true
  }
}
