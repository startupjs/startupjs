// guess input type based on schema type and props
export function guessInput (input, type, props) {
  if (input) return input
  if (type) {
    if (props.enum) return 'select'
    if (SCHEMA_TYPES_TO_INPUT[type]) return SCHEMA_TYPES_TO_INPUT[type]
    return type
  }
  return 'text'
}

export const EXTRA_SCHEMA_TYPES = ['string', 'boolean', 'integer']

export const SCHEMA_TYPES_TO_INPUT = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number',
  number: 'number',
  array: 'array',
  object: 'object'
}

function simpleNumericHash (s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}

export function getInputTestId (props) {
  if (props.testId) return props.testId

  const inputName = props.label || props.description || props.placeholder

  if (!inputName) return

  const nameHash = simpleNumericHash(inputName)
  const allowedCharacters = inputName.match(/\w+/g)

  return (allowedCharacters || []).join('_').slice(0, 20) + '-' + nameHash
}
