import FB from 'fb'
import { FIELDS } from '../../isomorphic'

export default function getFBProfile (accessToken) {
  return new Promise((resolve, reject) => {
    FB.api('me', { fields: FIELDS.join(','), access_token: accessToken }, function (res) {
      if (!res) reject(new Error('[@startupjs/auth-facebook] Error in getFBProfile'))
      resolve(res)
    })
  })
}
