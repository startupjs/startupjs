const ZSchema = require('z-schema')

class Schema {
  constructor (backend, options = {}) {
    if (!options.schemas) throw new Error('Schemas are required in options')

    const { schemas, validators = {}, formats = {} } = options

    this.options = options
    this.schemas = schemas
    this.customValidators = validators
    this.validator = new ZSchema()

    // register formats
    for (let format in formats) {
      ZSchema.registerFormat(format, options.formats[format])
    }
  }

  commitHandler = (shareRequest, done) => {
    const {
      snapshot: { data: newDoc },
      collection,
      op: opData
    } = shareRequest

    if (opData && opData.del) return done()

    try {
      this.validator.compileSchema(this.schemas)
    } catch (err) {
      err.message =
        'Cannnot validate schema: ' + JSON.stringify(this.schemas, null, 2)
      return done(err)
    }

    const rootSchema = this.schemas[collection]

    if (!rootSchema) {
      // throw error if current collenction have no schema
      // error can be skiped if you add skipNonExisting flag to your options
      if (this.options.skipNonExisting) return done()

      return done(Error(`No schema for collection: ${collection}`))
    }

    // Custom validator and complex objects contexts
    const contexts = this.getContexts(rootSchema, newDoc)

    const asyncErrors = this.runAsyncs(contexts)

    if (asyncErrors) {
      return done(
        Error(
          'async validators throw errors:' +
            JSON.stringify(asyncErrors, null, 2)
        )
      )
    }

    this.validate(newDoc, shareRequest, rootSchema, contexts, done)
  }

  runAsyncs = contexts => {
    const self = this
    const errors = []

    contexts.forEach(async context => {
      const customValidator = context.customValidator

      if (customValidator.async) {
        await customValidator.async.call(self, context, function (err, data) {
          if (err) errors.push(err)
        })
      }
    })
    if (errors.length) return errors
  }

  validate = (doc, shareRequest, schema, contexts, done) => {
    const errors = []

    const {
      collection: collectionName,
      channels: [, scopePath],
      snapshot: { data: snapshotData }
    } = shareRequest

    this.validator.validate(snapshotData, this.schemas[collectionName])
    const _errors = this.validator.getLastErrors()

    if (_errors && _errors.length) {
      _errors.forEach(err => {
        err.path = err.path.split('/').join('.').replace('#', scopePath)
        delete err.params
      })

      return done(Error('VALIDATION_ERRORS ' + JSON.stringify(_errors, null, 2)))
    }

    // Custom validators
    if (contexts) {
      contexts.forEach(context => {
        if (context.customValidator.sync && doc) {
          const err = context.customValidator.sync(doc, context)
          if (err) errors.push(err)
        }
      })
    }

    if (errors.length) {
      return errors
    }

    return done()
  }

  getContexts = (schema, value) => {
    let results = []

    if (!schema) {
      return results
    }

    if (schema.validators) {
      schema.validators.forEach(validatorName => {
        const customValidator = this.customValidators[validatorName]

        if (!customValidator) {
          throw Error('Unknown validator: ' + validatorName)
        }

        results.push({
          name: validatorName,
          customValidator,
          schema,
          value
        })
      })
    }

    return results
  }
}

module.exports = Schema
