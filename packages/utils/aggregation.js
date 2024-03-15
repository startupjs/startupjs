export const isAggregationFlag = '__isAggregation'

export function isAggregation (something) {
  return isAggregationFunction(something) || isAggregationHeader(something)
}

export function isAggregationFunction (fn) {
  return typeof fn === 'function' && fn[isAggregationFlag]
}

export function isAggregationHeader (aggregationMeta) {
  return validateAggregationMeta(aggregationMeta) && aggregationMeta[isAggregationFlag]
}

export function aggregation (aggregationFn) {
  if (typeof aggregationFn !== 'function') throw Error('aggregation: argument must be a function')
  aggregationFn[isAggregationFlag] = true
  return aggregationFn
}

// during compilation, calls to aggregation() are replaced with:
// aggregationHeader({ collection: 'collectionName', name: 'aggregationName' })
export function aggregationHeader (aggregationMeta) {
  if (!validateAggregationMeta(aggregationMeta)) {
    throw Error(ERRORS.wrongAggregationMeta(aggregationMeta))
  }
  aggregationMeta[isAggregationFlag] = true
  return aggregationMeta
}

function validateAggregationMeta (aggregationMeta) {
  if (
    typeof aggregationMeta === 'object' &&
    typeof aggregationMeta.collection === 'string' &&
    typeof aggregationMeta.name === 'string'
  ) return true
  return false
}

const ERRORS = {
  wrongAggregationMeta: (aggregationMeta) => `
    aggregationHeader: invalid aggregationMeta
      Expected: { collection: 'collectionName', name: 'aggregationName' }
      Received: ${JSON.stringify(aggregationMeta)}
  `
}
