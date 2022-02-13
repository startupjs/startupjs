import Base from './Base.js'
import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'

export default class Local extends Base {
  constructor (...args) {
    super(...args)
    this.path = this.params
  }

  refModel () {
    observablePath(this.path)
  }

  getData () {
    return this.$root.get(this.path)
  }

  getModelPath () {
    return this.path
  }

  getModel () {
    return this.$root.scope(this.path)
  }

  destroy () {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.path
    super.destroy()
  }
}
