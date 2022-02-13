import Query from './Query.js'

export default class QueryExtra extends Query {
  getData () {
    return this.$$query && this.$$query.getExtra()
  }
}
