// Simple mock to be able to call simple webpack loaders with filename substitution.
module.exports = function callLoader (loader, source, filename, options = {}) {
  let isAsync = false
  let resolveAsync
  let rejectAsync
  const markAsync = () => {
    isAsync = true
    return (err, result) => {
      if (err) return rejectAsync(err)
      resolveAsync(result)
    }
  }
  const result = loader.call({ resourcePath: filename, query: options, async: markAsync }, source)
  if (isAsync) {
    return new Promise((resolve, reject) => {
      resolveAsync = resolve
      rejectAsync = reject
    })
  } else {
    return result
  }
}
