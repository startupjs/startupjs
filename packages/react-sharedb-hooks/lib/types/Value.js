import Base from './Base.js'

export default class Value extends Base {
  constructor (...args) {
    super(...args)
    this.value = this.params
  }

  getData () {
    return this.$component.get(this.hookId)
  }

  getModelPath () {
    return this.$component.path(this.hookId)
  }

  getModel () {
    return this.$component.at(this.hookId)
  }

  refModel () {
    if (this.cancelled) return
    this.$component.setDiff(this.hookId, this.value)
  }

  unrefModel () {
    this.$component.del(this.hookId)
  }

  destroy () {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.value
    super.destroy()
  }
}
