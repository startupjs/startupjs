import Schema from './Schema.js'

export default function schema (backend, options) {
  const schema = new Schema(backend, options)

  backend.use('commit', schema.commitHandler)
}
