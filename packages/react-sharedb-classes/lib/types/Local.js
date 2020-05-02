const Base = require('./Base')
const { _observablePath: observablePath } = require('@startupjs/react-sharedb-util')

module.exports = class Local extends Base {
  constructor (...args) {
    super(...args)
    this.path = this.params
  }

  refModel () {
    if (this.cancelled) return
    const { key } = this
    observablePath(this.path)
    this.model.ref(key, this.model.root.scope(this.path))
  }

  unrefModel () {
    const { key } = this
    this.model.removeRef(key)
  }

  destroy () {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.path
    super.destroy()
  }
}
