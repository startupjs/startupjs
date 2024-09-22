let isDevelopment = checkIsDevelopment()

function checkIsDevelopment () {
  return typeof process !== 'undefined' && process?.env?.NODE_ENV && process.env.NODE_ENV === 'development'
}

export function setIsDevelopment (value) {
  isDevelopment = value
}

export default isDevelopment
