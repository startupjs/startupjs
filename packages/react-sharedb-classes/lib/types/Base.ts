export default class Base {
  key: string
  params: any
  model: any
  cancelled: boolean

  constructor (model: any, key: string, params: any) {
    this.key = key
    this.params = params
    this.model = model
  }

  refModel (): void {}

  unrefModel (): void {}

  destroy (): void {
    this.cancel()
    delete this.model
    delete this.params
    delete this.key
  }

  // Cancel initialization process
  cancel (): void {
    // If model doesn't exist, it means that the item was already destroyed,
    // so no need to cancel
    if (!this.cancelled) this.cancelled = true
  }
}
