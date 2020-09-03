export const delay = async timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}

export const isPromise = value => {
  return typeof value === 'object' && typeof value.then === 'function'
}
