import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _serverAggregate from '@startupjs/server-aggregate'
import { isAggregationFunction } from '@startupjs/utils/aggregation'

export default function serverAggregate (backend, { customCheck } = {}) {
  _serverAggregate(backend, { customCheck })

  for (const modelPattern in MODULE.models) {
    for (const aggregationName in MODULE.models[modelPattern]) {
      const aggregation = MODULE.models[modelPattern][aggregationName]
      if (!isAggregationFunction(aggregation)) continue
      // support only top-level collections
      const collectionName = modelPattern
      if (/\./.test(collectionName)) throw Error(ERRORS.onlyTopLevelCollections(modelPattern, aggregationName))
      backend.addAggregate(
        collectionName,
        aggregationName,
        (queryParams, shareRequest) => {
          const session = shareRequest.agent.connectSession
          const userId = session.userId
          const model = global.__clients[userId].model
          const context = { $root: model, model, session, userId }
          return aggregation(queryParams, context)
        }
      )
    }
  }

  console.log('✓ Security: only server-side aggregations are allowed')
}

const ERRORS = {
  onlyTopLevelCollections: (modelPattern, aggregationName) => `
    serverAggregate: you can only define aggregations in the top-level collection models
      (i.e. 'model/items.js')
      Found aggregation '${aggregationName}' in '${modelPattern}'.
      Move it to the top-level collection model: 'models/${modelPattern.split('.')[0]}.js'
  `
}
