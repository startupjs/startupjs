import { SEGMENTS } from './Signal.js'
import { set as _set, del as _del } from './dataTree.js'

export const LOCAL = '$local'

class ValueSubscriptions {
  constructor () {
    this.initialized = new Map()
    this.fr = new FinalizationRegistry(id => this.destroy(id))
  }

  init ($value, value) {
    const id = $value[SEGMENTS][1]
    if (this.initialized.has(id)) return

    _set([LOCAL, id], value)
    this.initialized.set(id, true)
    this.fr.register($value, id)
  }

  destroy (id) {
    this.initialized.delete(id)
    _del([LOCAL, id])
  }
}

export const valueSubscriptions = new ValueSubscriptions()
