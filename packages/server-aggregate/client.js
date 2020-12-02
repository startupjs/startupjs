const racer = require('racer')
const { Model } = racer

Model.prototype.aggregateQuery = function (collection, queryName, params) {
  params = params || {}

  return this.query(collection, {
    $queryName: queryName,
    $params: params
  })
}
