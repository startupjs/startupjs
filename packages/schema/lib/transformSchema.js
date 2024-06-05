import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _isPlainObject from 'lodash/isPlainObject.js'

// allow schema to be specified in a simplified format - as "properties" themselves
// and also with 'required' being part of each property
export default function transformSchema (schema, { additionalProperties = false } = {}) {
  schema = JSON.parse(JSON.stringify(schema))

  if (schema.type !== 'object') {
    const properties = {}
    const required = []

    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        const value = schema[key]

        const type = value.originalType || value.type

        properties[key] = { ...value, type }
        delete properties[key].originalType

        if (value.required === true) {
          required.push(key)
        }
      }
    }
    schema = {
      type: 'object',
      properties,
      required,
      additionalProperties
    }
  } else {
    Object.keys(schema.properties).forEach(key => {
      const prop = schema.properties[key]
      if (prop.originalType) {
        prop.type = prop.originalType
      }
    })
  }

  stripExtraUiKeywords(schema)
  schema = MODULE.reduceHook('transformSchema', schema)
  return schema
}

// traverse type 'object' and type 'array' recursively
// and remove extra keywords (like a boolean 'require') from all objects in schema
// WARNING: this is self-mutating
function stripExtraUiKeywords (schema) {
  if (schema.type === 'object') {
    for (const key in schema.properties) {
      const property = schema.properties[key]
      if (_isPlainObject(property)) {
        if (typeof property.required === 'boolean') delete property.required
        stripExtraUiKeywords(property)
      }
    }
  } else if (schema.type === 'array') {
    stripExtraUiKeywords(schema.items)
  }
}
