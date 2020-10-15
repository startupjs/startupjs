const Schema = require('./Schema')

module.exports = function plugin (backend, options) {
  const schema = new Schema(backend, options)

  backend.use('commit', schema.commitHandler)
}
