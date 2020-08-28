// Simple mock to be able to call simple webpack loaders with filename substitution.
module.exports = function callLoader (loader, source, filename, options = {}) {
  return loader.call({ resourcePath: filename, query: options }, source)
}
