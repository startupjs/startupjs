import CookieManager from '@react-native-cookies/cookies'

function _CookieManager () {}

_CookieManager.set = async function ({
  baseUrl,
  name,
  value,
  expires
}) {
  await CookieManager.set(baseUrl, {
    name,
    value,
    expires
  })
}

export default _CookieManager
