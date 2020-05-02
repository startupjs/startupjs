import Base from './Base'

export default class Value extends Base {
  constructor (...args) {
    super(...args)
    this.value = this.params
  }

  refModel () {
    if (this.cancelled) return
    let { key } = this
    this.model.setDiff(key, this.value)
  }

  unrefModel () {
    let { key } = this
    this.model.del(key)
  }

  destroy () {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.value
    super.destroy()
  }
}
