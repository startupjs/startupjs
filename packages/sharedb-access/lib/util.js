
const relevantPath = (pattern, op) => {
  let segments = segmentsFor(op)
  let patternSegments = pattern.split('.')

  if (segments.length !== patternSegments.length) {
    return false
  }

  if (patternSegments.indexOf('*') === -1) {
    return segments.join('.') === patternSegments.join('.')
  }

  let regExp = patternToRegExp(patternSegments.join('.'))

  return regExp.test(segments.join('.'))
}

const lookup = (segments, doc) => {
  let curr = doc
  let part

  for (let i = 0; i < segments.length; i++) {
    part = segments[i]
    if (curr !== 0) {
      curr = curr[part]
    }
  }
  return curr
}

const patternToRegExp = (pattern) => {
  let regExpString = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '(.+)')
    .replace(/\*/g, '([^.]+)')

  return new RegExp('^' + regExpString + '$')
}

const segmentsFor = (item) => {
  let relativeSegments = item.p

  if (normalPath(item)) return relativeSegments

  return relativeSegments.slice(0, -1)
}

const normalPath = (item) => {
  return 'oi' in item || 'od' in item || 'li' in item || 'ld' in item || 'na' in item
}

module.exports = {
  relevantPath,
  lookup,
  patternToRegExp,
  segmentsFor,
  normalPath
}
