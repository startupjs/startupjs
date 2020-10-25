import { observable } from '@nx-js/observer-util'
import { _semaphore as semaphore } from '@startupjs/react-sharedb-util'
import $root from '@startupjs/model'

const COLLECTION = '$components'

export default class Meta {
  constructor () {
    this.componentId = $root.id()
    this.$self = $root
      .context(this.componentId)
      .scope(`${COLLECTION}.${this.componentId}`)
    semaphore.allowComponentSetter = true
    this.$self.set('', observable({}))
    semaphore.allowComponentSetter = false
    this.createdAt = Date.now()

    this.destroy = this.destroy.bind(this)
  }

  destroy () {
    semaphore.allowComponentSetter = true
    // Unsubscribe from everything this component was subscribed to
    $root.unload(this.componentId)
    // Destroy the model of this component and everything within it
    this.$self.destroy()
    semaphore.allowComponentSetter = false
    delete this.$self
  }
}
