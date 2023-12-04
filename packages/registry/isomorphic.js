const Registry = require('./lib/Registry')

const registry = new Registry({ env: 'isomorphic' })
module.exports = exports = registry
exports.getModule = moduleName => registry.getModule(moduleName)
