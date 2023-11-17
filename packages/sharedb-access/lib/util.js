export function relevantPath (pattern, op) {
  const segments = segmentsFor(op)
  const patternSegments = pattern.split('.')

  if (segments.length !== patternSegments.length) {
    return false
  }

  if (patternSegments.indexOf('*') === -1) {
    return segments.join('.') === patternSegments.join('.')
  }

  const regExp = patternToRegExp(patternSegments.join('.'))

  return regExp.test(segments.join('.'))
}

export function lookup (segments, doc) {
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

export function patternToRegExp (pattern) {
  const regExpString = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '(.+)')
    .replace(/\*/g, '([^.]+)')

  return new RegExp('^' + regExpString + '$')
}

export function segmentsFor (item) {
  const relativeSegments = item.p

  if (normalPath(item)) return relativeSegments

  return relativeSegments.slice(0, -1)
}

export function normalPath (item) {
  return 'oi' in item || 'od' in item || 'li' in item || 'ld' in item || 'na' in item
}
