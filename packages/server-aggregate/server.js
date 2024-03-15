import ShareDBAccessError from './error.js'
import { ACCESS_ERROR_CODES } from './constants.js'

const {
  ERR_ACCESS_ONLY_SERVER_AGGREATE,
  ERR_ACCESS_NO_SERVER_AGGREGATE_NAME,
  ERR_ACCESS_IN_SERVER_QUERY
} = ACCESS_ERROR_CODES

const QUERIES = {}

export default (backend, { customCheck } = {}) => {
  backend.addAggregate = (collection, queryName, queryFunction) => {
    QUERIES[collection + '.' + queryName] = queryFunction
  }

  const handleQuery = async (shareRequest) => {
    const { query, collection } = shareRequest

    const queryName = query.$aggregationName
    let queryParams = query.$params

    if (query.$aggregate) {
      throw new ShareDBAccessError(ERR_ACCESS_ONLY_SERVER_AGGREATE, `
        access denied - only server-queries for $aggregate are allowed
        collection: '${collection}',
        query: \n${JSON.stringify(query, null, 2)}
      `)
    }
    if (!queryName && !queryParams) return

    queryParams = queryParams || {}

    const queryFunction = QUERIES[collection + '.' + queryName]

    if (!queryFunction) {
      throw new ShareDBAccessError(
        ERR_ACCESS_NO_SERVER_AGGREGATE_NAME,
        'there is no such server-query, name: ' +
        `'${queryName}', collection: '${collection}'`
      )
    }

    let serverQuery

    try {
      serverQuery = await queryFunction(queryParams, shareRequest)
    } catch (err) {
      throw new ShareDBAccessError(ERR_ACCESS_IN_SERVER_QUERY, err.message)
    }

    if (isString(serverQuery)) throw new ShareDBAccessError(ERR_ACCESS_IN_SERVER_QUERY, serverQuery)

    if (Array.isArray(serverQuery)) serverQuery = { $aggregate: serverQuery }

    if (typeof serverQuery !== 'object') {
      throw new ShareDBAccessError(ERR_ACCESS_IN_SERVER_QUERY, `
        access denied for server aggregation
        {
          collection: '${collection}',
          $aggregationName: '${queryName}'
        }
      `)
    }

    if (customCheck) {
      const customPermissionMessage = await customCheck(shareRequest)
      if (isString(customPermissionMessage)) {
        throw new ShareDBAccessError(ERR_ACCESS_IN_SERVER_QUERY, customPermissionMessage)
      }
    }

    shareRequest.query = serverQuery
  }

  backend.use('query', (shareRequest, next) => {
    handleQuery(shareRequest).then(() => {
      next()
    }).catch((err) => {
      next(err)
    })
  })
}

function isString (obj) {
  return typeof obj === 'string' || obj instanceof String
}
