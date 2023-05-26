const ZSchema = require('z-schema')

class Schema {
  constructor (backend, options = {}) {
    if (!options.schemas) throw new Error('Schemas are required in options')

    const { schemas, validators = {}, formats = {} } = options

    this.backend = backend
    this.model = backend.createModel()
    this.options = options
    this.schemas = schemas
    this.customValidators = validators
    this.validator = new ZSchema()

    // register formats
    for (let format in formats) {
      ZSchema.registerFormat(format, options.formats[format])
    }
  }

  commitHandler = async (shareRequest, done) => {
    const {
      snapshot: { data: newDoc },
      id: docId,
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

    let rootSchema = this.schemas[collection]
    // we need to check the type of rootSchema because the non factory schema can have the 'factory' field
    if (typeof rootSchema === 'function' && rootSchema.factory) {
      // get model from factory like in @startupjs/orm: https://github.com/startupjs/startupjs/blob/master/packages/orm/lib/index.js#L77
      const $doc = this.model._scope(`${collection}.${docId}`)
      await $doc.subscribe()
      const factoryModel = rootSchema($doc, this.model)
      rootSchema = factoryModel.constructor.schema
      $doc.unsubscribe()
    }

    if (!rootSchema || !rootSchema.properties) {
      // throw error if current collection have no schema
      // error can be skiped if you add skipNonExisting flag to your options
      if (this.options.skipNonExisting) return done()

      return done(Error(`No schema for collection: ${collection}`))
    }

    // Custom validator and complex objects contexts
    const contexts = this.getContexts(rootSchema, newDoc)

    const asyncErrors = await this.runAsyncs(contexts)

    if (asyncErrors && asyncErrors.length) {
      return done(asyncErrors[0])
    }

    const errors = this.validate(
      newDoc,
      shareRequest,
      rootSchema,
      contexts,
      done
    )

    if (errors && errors.length) {
      done(errors[0])
    }
  }

  runAsyncs = async contexts => {
    const self = this
    const errors = []

    Object.keys(contexts).forEach(key => {
      contexts[key].validators.forEach(async name => {
        const customValidator = this.customValidators[name]
        if (customValidator.async) {
          await customValidator.async.call(self, contexts[key], function (
            error
          ) {
            if (error) errors.push(error)
          })
        }
      })
    })
    return errors
  }

  validate = (doc, shareRequest, schema, contexts, done) => {
    const errors = []

    const {
      collection: collectionName,
      channels: [, scopePath],
      snapshot: { data: snapshotData },
      op: opData
    } = shareRequest

    this.validator.validate(snapshotData, schema)
    const _errors = this.validator.getLastErrors()

    if (_errors && _errors.length) {
      _errors.forEach(err => {
        if (opData.constructor.name !== 'EditOp') {
          err.relativePath = err.path.replace('#/', '').split('/').join('.')
        } else {
          // err.relativePath = err.params[0]
          // err.path = err.path.concat(err.params[0])
        }

        err.path = err.path
          .split('/')
          .filter(Boolean)
          .join('.')
          .replace('#', scopePath)

        err.collection = collectionName
        delete err.params
      })

      return done(
        Error(
          JSON.stringify(_errors, null, 2)
        ) /* JSON.stringify(_error, null, 2) */
      )
    }

    // Custom validators
    Object.keys(contexts).forEach(key => {
      contexts[key].validators.forEach(name => {
        const customValidator = this.customValidators[name]
        if (customValidator.sync) {
          const error = customValidator.sync(
            contexts[key].value,
            contexts[key],
            key
          )
          if (error) errors.push(error)
        }
      })
    })

    if (errors.length) {
      return errors
    }

    return done()
  }

  getContexts = (schema, value) => {
    let partialSchema = {}

    if (!schema) {
      return partialSchema
    }

    Object.keys(value).forEach(key => {
      schema.properties[key] && flatten(schema.properties[key], key)
      if (partialSchema[key]) {
        partialSchema[key].schema = schema.properties[key]
        partialSchema[key].value = value[key]
      }
    })

    function flatten (schema, partialKey) {
      if (Object.keys(schema).includes('validators')) {
        partialSchema[partialKey] = { ...schema }
      }
      Object.keys(schema).forEach(key => {
        if (
          schema[key] !== null &&
          !Array.isArray(schema[key]) &&
          typeof schema[key] === 'object'
        ) {
          if (Object.keys(schema[key]).includes('validators')) {
            partialSchema[partialKey] = { ...schema[key] }
          }
          flatten(schema[key], partialKey)
        }
      })
    }

    return partialSchema
  }
}

module.exports = Schema
