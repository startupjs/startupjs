import { ROOT_MODULE as MODULE } from '@startupjs/registry'
import _isPlainObject from 'lodash/isPlainObject.js'

// allow schema to be specified in a simplified format - as "properties" themselves
// and also with 'required' being part of each property
export default function transformSchema (schema) {
  schema = JSON.parse(JSON.stringify(schema))
  // if schema is not an object, assume it's in a simplified format
  if (schema.type !== 'object') {
    schema = {
      type: 'object',
      properties: schema,
      required: Object.keys(schema).filter(
        // gather all required fields
        // (only if explicitly set to a boolean `true` to not interfere with object's 'required' array)
        key => schema[key] && schema[key].required === true
      ),
      additionalProperties: false
    }
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
