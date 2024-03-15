import sharedbSchema from '@startupjs/sharedb-schema'
import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import { transformSchema } from '@startupjs/schema'

export default function validateSchema (backend) {
  const schemaPerCollection = { schemas: {}, formats: {}, validators: {} }

  for (const modelPattern in MODULE.models) {
    let { schema, factory } = MODULE.models[modelPattern]

    if (factory) {
      // TODO: implement getting schema from factory
      // schemaPerCollection.schemas[modelPattern.replace('.*', '')] = ORM[path].OrmEntity
      throw Error('factory model: NOT IMPLEMENTED')
    } else if (schema) {
      const collectionName = modelPattern
      if (/\./.test(collectionName)) throw Error(ERRORS.onlyTopLevelCollections(modelPattern))
      // transform schema from simplified format to full format
      schema = transformSchema(schema, { collectionName })
      schemaPerCollection.schemas[collectionName] = schema
    }

    // allow any 'service' collection structure
    // since 'service' collection is used in our startupjs libraries
    // and we don't have a tool to collect scheme from all packages right now
    schemaPerCollection.schemas.service = transformSchema({
      type: 'object', properties: {}, additionalProperties: true
    })
  }

  sharedbSchema(backend, schemaPerCollection)
  console.log('✓ Security: JSON-schema validation of DB collections on backend is enabled')
}

const ERRORS = {
  onlyTopLevelCollections: (modelPattern, aggregationName) => `
    validateSchema: you can only define schema in the top-level collection models
      (i.e. 'model/items.js')
      Found schema in '${modelPattern}'.
      Move it to the top-level collection model: 'models/${modelPattern.split('.')[0]}.js'
  `
}
