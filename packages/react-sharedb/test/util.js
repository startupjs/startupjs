import isArray from 'lodash/isArray'

export function alias (number) {
  const name = n => `test${n}_`
  if (isArray(number)) {
    return number.map(n => name(n))
  } else {
    return name(number)
  }
}
