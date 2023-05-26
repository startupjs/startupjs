import Query from './Query.js'

export default class QueryExtra extends Query {
  refModel () {
    if (this.cancelled) return
    const { key } = this
    this.subscription.refExtra(this.model.at(key))
  }

  unrefModel () {
    const { key } = this
    this.model.removeRef(key)
  }
}
