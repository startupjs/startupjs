import { loginLock } from '@startupjs/auth/server'

const ALLOWED_FAILED_LOGIN_ATTEMPTS = 10

export default async function setLoginAttempts (req, res, next) {
  const { model, body } = req

  const $auths = model.query('auths', { 'providers.local.email': body.email })
  await $auths.subscribe()
  const authDoc = $auths.get()[0]

  if (authDoc) {
    const $auth = model.scope(`auths.${authDoc.id}`)
    const failedLoginAttempts = $auth.get('providers.local.failedLoginAttempts') || 0

    if (failedLoginAttempts > ALLOWED_FAILED_LOGIN_ATTEMPTS) {
      await $auth.del('providers.local.failedLoginAttempts')
      return loginLock(authDoc.id, req, res)
    } else {
      await $auth.set('providers.local.failedLoginAttempts', failedLoginAttempts + 1)
    }
  }

  next()
}
