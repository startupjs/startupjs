let isAsync

export function resetCatcher () {
  isAsync = false
}

export function getAsync () {
  return isAsync
}

export function markAsync () {
  isAsync = true
}
