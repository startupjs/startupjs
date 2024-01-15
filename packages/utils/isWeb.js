let isWeb = checkIsWeb()

function checkIsWeb () {
  return Boolean(typeof window !== 'undefined' && window.location?.origin)
}

export function setIsWeb (value) {
  isWeb = value
}

export default isWeb
