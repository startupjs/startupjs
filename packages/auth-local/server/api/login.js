import { finishAuth } from '@startupjs/auth/server'
import passport from 'passport'

export default async function login (req, res, next, config) {
  const { onBeforeLoginHook, onAfterLoginHook } = config

  passport.authenticate('local', async function (err, userId, info) {
    if (err) {
      console.log('[@startup/auth-local] Error:', err)
      return next(err)
    }

    const _onAfterLoginHook = async function (userId) {
      onAfterLoginHook && await onAfterLoginHook({ userId }, req)
      await clearLoginAttempts(userId, req.model)
    }

    finishAuth(req, res, { userId, onBeforeLoginHook, onAfterLoginHook: _onAfterLoginHook })
  })(req, res, next)
}

async function clearLoginAttempts (userId, model) {
  const $auth = model.scope(`auths.${userId}`)
  await $auth.subscribe()

  await $auth.del('providers.local.failedLoginAttempts')

  $auth.unsubscribe()
}
