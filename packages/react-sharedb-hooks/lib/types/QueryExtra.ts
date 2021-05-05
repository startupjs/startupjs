import Query from './Query'

export default class QueryExtra extends Query {
  refModel (): void {
    if (this.cancelled) return
    const { key } = this
    this.subscription.refExtra(this.model.at(key))
  }

  unrefModel (): void {
    const { key } = this
    this.model.removeRef(key)
  }
}
