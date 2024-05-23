// guess input type based on schema type and props
export default function guessInput (input, type, props) {
  if (input) return input
  if (type) {
    if (props.enum) return 'select'
    if (SCHEMA_TYPES_TO_INPUT[type]) return SCHEMA_TYPES_TO_INPUT[type]
    return type
  }
  return 'text'
}

export const SCHEMA_TYPES_TO_INPUT = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number',
  number: 'number',
  array: 'array',
  object: 'object'
}
