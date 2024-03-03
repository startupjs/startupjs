/**
 * Pick properties from json-schema to be used in a form.
 * Supports simplified schema (just the properties object) and full schema.
 * Performs extra transformations like auto-generating `label`.
 * `createdAt`, `updatedAt`, `id`, `_id` fields are excluded by default.
 * @param {Object} schema
 * @param {Object|Array} options - exclude or include fields. If array, it's the same as passing { include: [...] }
 * @param {Array} options.include - list of fields to pick (default: all)
 * @param {Array} options.exclude - list of fields to exclude (default: none)
 */
export function pickFormFields (schema, options) {
  try {
    let include, exclude
    if (Array.isArray(options)) {
      include = options
    } else {
      ;({ include, exclude } = options || {})
    }
    exclude ??= []
    if (!schema) throw Error('pickFormFields: schema is required')
    schema = JSON.parse(JSON.stringify(schema))
    if (schema.type === 'object') {
      schema = schema.properties
    }
    for (const key in schema) {
      if (shouldIncludeField(key, schema[key], { include, exclude })) {
        const field = schema[key]
        if (!field.label) field.label = camelCaseToLabel(key)
      } else {
        delete schema[key]
      }
    }
    return schema
  } catch (err) {
    throw Error(`
      pickFormFields: ${err.message}
      schema:\n${JSON.stringify(schema, null, 2)}
    `)
  }
}

function shouldIncludeField (key, field, { include, exclude = [] } = {}) {
  if (!field) throw Error(`field "${key}" does not have a schema definition`)
  if (include?.includes(key)) return true
  if (exclude.includes(key)) return false
  if (DEFAULT_EXCLUDE_FORM_FIELDS.includes(key)) return false
  // exclude foreign keys by default
  // (they have a custom `$collection` property set by belongsTo() or hasMany() helpers)
  if (field.$collection) return false
  // if include array is not explicitly set, include all fields by default
  if (!include) return true
  return false
}

const DEFAULT_EXCLUDE_FORM_FIELDS = ['id', '_id', 'createdAt', 'updatedAt']

// split into words, capitalize first word, make others lowercase
function camelCaseToLabel (str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, (s) => s.toUpperCase())
}

export const GUID_PATTERN = '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
