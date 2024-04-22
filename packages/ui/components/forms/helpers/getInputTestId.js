export default function getInputTestId (props) {
  if (props.testId) return props.testId

  const inputName = props.label || props.description || props.placeholder

  if (!inputName || typeof inputName !== 'string') return

  const nameHash = simpleNumericHash(inputName)
  const allowedCharacters = inputName.match(/\w+/g)

  return (allowedCharacters || []).join('_').slice(0, 20) + '-' + nameHash
}

function simpleNumericHash (s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0
  return h
}
