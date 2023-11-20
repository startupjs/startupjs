import racer from 'racer'

const { Model } = racer

Model.prototype.aggregateQuery = function (collection, queryName, params) {
  params = params || {}

  return this.query(collection, {
    $aggregationName: queryName,
    $params: params
  })
}
