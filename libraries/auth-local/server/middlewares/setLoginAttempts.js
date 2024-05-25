import { loginLock } from '@startupjs/auth/server/index.js'
import Provider from '../Provider.js'

const ALLOWED_FAILED_LOGIN_ATTEMPTS = 5
const LIFETIME_FAILED_LOGIN_ATTEMPTS = 1 * 60 * 1000

export default function setLoginAttempts (config) {
  return async function (req, res, next) {
    const { model, body } = req
    const provider = new Provider(model, { email: body.email }, config)
    const auth = await provider.loadAuthData()

    if (auth) {
      const authId = auth.id
      const now = Date.now()
      const $auth = model.scope(`auths.${authId}`)

      await $auth.subscribe()

      const failedLoginTimestamp = $auth.get('providers.local.failedLoginTimestamp')

      // strange behaviour to prevent brute-force attacks
      // because login tries counts before login call
      if (
        failedLoginTimestamp &&
        failedLoginTimestamp + LIFETIME_FAILED_LOGIN_ATTEMPTS > now
      ) {
        await $auth.increment('providers.local.failedLoginAttempts')
      } else {
        await $auth.set('providers.local.failedLoginAttempts', 1)
      }

      await $auth.set('providers.local.failedLoginTimestamp', now)

      if ($auth.get('providers.local.failedLoginAttempts') >= ALLOWED_FAILED_LOGIN_ATTEMPTS) {
        await $auth.del('providers.local.failedLoginAttempts')
        await $auth.del('providers.local.failedLoginTimestamp')
        return loginLock(authId, req, res)
      }
    }

    next()
  }
}
