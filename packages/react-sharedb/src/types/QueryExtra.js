import Query from './Query'

const MAX_LISTENERS = 100

export default class QueryExtra extends Query {
  refModel () {
    if (this.cancelled) return
    let { key } = this
    this.subscription.refExtra(this.model.at(key))
  }

  unrefModel () {
    let { key } = this
    this.model.removeRef(key)
  }
}
