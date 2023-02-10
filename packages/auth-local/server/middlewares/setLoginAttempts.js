import { loginLock } from '@startupjs/auth/server'

const ALLOWED_FAILED_LOGIN_ATTEMPTS = 5
const LIFETIME_FAILED_LOGIN_ATTEMPTS = 3 * 60 * 1000

export default async function setLoginAttempts (req, res, next) {
  const { model, body } = req

  const $auths = model.query('auths', {
    $or: [
      { 'providers.local.email': body.email },
      // Generally we don't need an provider id to perform auth
      // auth proces depends on provider.email field only
      // but earlier implementation of auth lib used provideer.id in local strategy
      // Those lines is added only for backward compabilities reasons
      { 'providers.local.id': body.email }
    ]
  })
  await $auths.subscribe()
  const authDoc = $auths.get()[0]
  const now = Date.now()

  if (authDoc) {
    const $auth = model.scope(`auths.${authDoc.id}`)
    const failedLoginAttempts = $auth.get('providers.local.failedLoginAttempts') || 0
    const failedLoginTimestamp = $auth.get('providers.local.failedLoginTimestamp') || 0

    if (
      failedLoginTimestamp +
      LIFETIME_FAILED_LOGIN_ATTEMPTS >
      now &&
      failedLoginAttempts % 5 === 0
    ) {
      await $auth.del('providers.local.failedLoginAttempts')
      await $auth.del('providers.local.failedLoginTimestamp')
      return loginLock(authDoc.id, req, res)
    } else {
      await $auth.set('providers.local.failedLoginAttempts', failedLoginAttempts + 1)
      await $auth.set('providers.local.failedLoginTimestamp', now)
    }
  }

  next()
}
