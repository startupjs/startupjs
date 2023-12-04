export const SCHEMA_TYPE_TO_INPUT = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number'
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
