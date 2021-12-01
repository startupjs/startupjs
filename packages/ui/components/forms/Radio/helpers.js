export function getOptionLabel (option) {
  return option?.label || option
}

export function getOptionDescription (option) {
  return option?.description
}

export function stringifyValue (option) {
  return JSON.stringify(option?.value || option)
}

export function parseValue (value) {
  return JSON.parse(value)
}
