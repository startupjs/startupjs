const ShareDBAccessError = require('./error')
const {
  ERR_ACCESS_ONLY_SERVER_AGGREATE,
  ERR_ACCESS_NO_SERVER_AGGREGATE_NAME,
  ERR_ACCESS_IN_SERVER_QUERY
} = require('./constants').ACCESS_ERROR_CODES

const QUERIES = {}

module.exports = (backend, customCheck) => {
  backend.addAggregate = (collection, queryName, queryFunction) => {
    QUERIES[collection + '.' + queryName] = queryFunction
  }

  const handleQuery = async (shareRequest) => {
    const { query, collection } = shareRequest

    const queryName = query.$aggregationName
    let queryParams = query.$params

    if (query.$aggregate) throw new ShareDBAccessError(ERR_ACCESS_ONLY_SERVER_AGGREATE, `access denied - only server-queries for $aggregate are allowed, collection: '${collection}', query: '${query}'`)
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

    if (customCheck) {
      const customPermissionMessage = await customCheck(shareRequest)
      if (isString(customPermissionMessage)) {
        throw new ShareDBAccessError(ERR_ACCESS_IN_SERVER_QUERY, customPermissionMessage)
      }
    }

    shareRequest.query = { $aggregate: serverQuery }
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
