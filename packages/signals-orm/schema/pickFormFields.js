/**
 * Pick properties from json-schema to be used in a form.
 * Supports simplified schema (just the properties object) and full schema.
 * Performs extra transformations like auto-generating `label`.
 * `createdAt`, `updatedAt`, `id`, `_id` fields are excluded by default.
 * @param {Object} schema
 * @param {Object|Array} options - exclude or include fields. If array, it's the same as passing { include: [...] }
 * @param {Array} options.include - list of fields to pick (default: all)
 * @param {Array} options.exclude - list of fields to exclude (default: none)
 * @param {Boolean} options.freeze - whether to deep freeze the result (default: true)
 */
export default function pickFormFields (schema, options) {
  try {
    let include, exclude, freeze
    if (Array.isArray(options)) {
      include = options
    } else {
      ;({ include, exclude, freeze = true } = options || {})
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
    if (freeze) return new Proxy(schema, deepFreezeHandler)
    return schema
  } catch (err) {
    throw Error(`
      pickFormFields: ${err.message}
      schema:\n${JSON.stringify(schema, null, 2)}
    `)
  }
}

// Proxy handlers to deep freeze schema to prevent accidental mutations.
// For this, when we .get() a property, we also return the same recursive Proxy handler if it's an object.
const deepFreezeHandler = {
  get (target, prop) {
    const value = target[prop]
    if (typeof value === 'object' && value !== null) {
      return new Proxy(value, deepFreezeHandler)
    }
    return value
  },
  set () {
    throw Error(ERRORS.schemaIsFrozen)
  }
}

function shouldIncludeField (key, field, { include, exclude = [] } = {}) {
  if (!field) throw Error(`field "${key}" does not have a schema definition`)
  if (include?.includes(key)) return true
  if (exclude.includes(key)) return false
  // if field has 'input' specified then it's an explicit indicator that it can be used in forms,
  // so the default exclusion rules don't apply
  if (!field.input) {
    // exclude some meta fields by default
    if (DEFAULT_EXCLUDE_FORM_FIELDS.includes(key)) return false
    // exclude foreign keys by default
    // Foreign keys have a custom `$association` property set by belongsTo/hasMany/hasOne helpers
    if (field.$association) return false
  }
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

const ERRORS = {
  schemaIsFrozen: `
    Form fields are immutable.
    If you want to change them, clone them with \`JSON.parse(JSON.stringify(FORM_FIELDS))\`.

    If you want to do it inside react component, you can use this pattern for the most effective cloning:

    \`\`\`
        const $fields = useValue$(useMemo(() => JSON.parse(JSON.stringify(FORM_FIELDS)), []))
    \`\`\`

    and then pass $fields to the Form component like this:

    \`\`\`
        <Form $fields={$fields} $value={$value} />
    \`\`\`
  `
}
