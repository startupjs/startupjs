import _ from 'lodash'

export function alias (number) {
  const name = n => `test${n}_`
  if (_.isArray(number)) {
    return number.map(n => name(n))
  } else {
    return name(number)
  }
}
