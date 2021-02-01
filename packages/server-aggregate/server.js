const QUERIES = {}
const errors = {
  access_denied: "403: access denied - only server-queries for $aggregate are allowed, collection: '{0}', query: '{2}'",
  unknown_name: "403: there is no such server-query, name: '{1}', collection: '{0}'",
  query_error: "403: there is an error in the server query, name: '{1}', collection: '{0}', params: '{3}', error: '{4}'"
}

module.exports = (backend, customCheck) => {
  backend.addAggregate = (collection, queryName, queryFunction) => {
    QUERIES[collection + '.' + queryName] = queryFunction
  }

  const handleQuery = async (shareRequest) => {
    const { query, collection } = shareRequest

    const queryName = query.$aggregationName
    let queryParams = query.$params

    if (query.$aggregate) return err('access_denied')
    if (!queryName && !queryParams) return

    queryParams = queryParams || {}

    const queryFunction = QUERIES[collection + '.' + queryName]

    if (!queryFunction) return err('unknown_name')

    let serverQuery
    try {
      serverQuery = await queryFunction(queryParams, shareRequest)
    } catch (e) {
      return err('query_error', e)
    }

    if (isString(serverQuery)) return err('query_error', serverQuery)

    if (customCheck) {
      const customPermissionMessage = await customCheck(shareRequest)
      if (isString(customPermissionMessage)) {
        return err('query_error', customPermissionMessage)
      }
    }

    shareRequest.query = { $aggregate: serverQuery }

    function err (name, text) {
      return formatString(
        errors[name],
        collection,
        queryName,
        JSON.stringify(query),
        JSON.stringify(queryParams),
        String(text)
      )
    }
  }

  backend.use('query', (shareRequest, next) => {
    handleQuery(shareRequest).then((err) => {
      const errorMessage = err && getErrorMessage(err)
      err && console.error(errorMessage)
      next(errorMessage)
    }).catch((err) => {
      next(err)
    })
  })
}

function getErrorMessage (err) {
  return { message: err, code: 403 }
}

function formatString (str) {
  const args = arguments
  return str.replace(/{(\d+)}/g, function (match, number) {
    return (typeof args[+number + 1] !== 'undefined') ? args[+number + 1] : match
  })
}

function isString (obj) {
  return typeof obj === 'string' || obj instanceof String
}
