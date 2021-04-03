import CookieManager from 'js-cookie'

function _CookieManager () {}

_CookieManager.set = function ({
  baseUrl,
  name,
  value,
  expires
}) {
  const { hostname } = new URL(baseUrl)

  CookieManager.set(name, value, {
    domain: hostname,
    expires: expires.toDate()
  })
}

export default _CookieManager
