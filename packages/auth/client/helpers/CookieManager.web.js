import CookieManager from 'js-cookie'

function _CookieManager () {}

_CookieManager.set = function ({
  baseUrl,
  name,
  value,
  expires
}) {
  CookieManager.set(name, value)
}

export default _CookieManager
