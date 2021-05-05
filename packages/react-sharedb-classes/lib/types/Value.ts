import Base from './Base'

export default class Value extends Base {
  value: any

  constructor (model: any, key: string, params: any) {
    super(model, key, params)
    this.value = this.params
  }

  refModel (): void {
    if (this.cancelled) return
    const { key } = this
    this.model.setDiff(key, this.value)
  }

  unrefModel (): void {
    const { key } = this
    this.model.del(key)
  }

  destroy (): void {
    // this.unrefModel() // TODO: Maybe enable unref in future
    delete this.value
    super.destroy()
  }
}
