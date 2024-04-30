export const MODELS = {}

export default function addModel (pattern, Model) {
  if (typeof pattern !== 'string') throw Error('Model pattern must be a string, e.g. "users.*"')
  if (/\s/.test(pattern)) throw Error('Model pattern can not have spaces')
  if (typeof Model !== 'function') throw Error('Model must be a class')
  pattern = pattern.replace(/\[[^\]]+\]/g, '*') // replace `[id]` with `*`
  if (pattern !== '' && pattern.split('.').some(segment => segment === '')) {
    throw Error('Model pattern can not have empty segments')
  }
  if (MODELS[pattern]) throw Error(`Model for pattern "${pattern}" already exists`)
  MODELS[pattern] = Model
}

export function findModel (segments) {
  // if segments is an empty array, treat it as a top-level signal.
  // Top-level signal class is the one that has an empty string as a pattern.
  if (segments.length === 0) segments = ['']
  for (const pattern in MODELS) {
    const patternSegments = pattern.split('.')
    if (segments.length !== patternSegments.length) continue
    let match = true
    for (let i = 0; i < segments.length; i++) {
      if (patternSegments[i] !== '*' && patternSegments[i] !== segments[i]) {
        match = false
        break
      }
    }
    if (match) return MODELS[pattern]
  }
}
