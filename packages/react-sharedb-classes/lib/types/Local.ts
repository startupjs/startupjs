import Base from './Base'
import { _observablePath as observablePath } from '@startupjs/react-sharedb-util'

export default class Local extends Base {
  path: string

  constructor (model, key: string, params) {
    super(model, key, params)
    this.path = this.params
  }

  init (): undefined {
    return undefined
  }

  refModel (): void {
    if (this.cancelled) return
    const { key } = this
    observablePath(this.path)
    this.model.ref(key, this.model.root.scope(this.path))
  }

  unrefModel (): void {
    const { key } = this
    this.model.removeRef(key)
  }

  destroy (): void {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.path
    super.destroy()
  }
}
