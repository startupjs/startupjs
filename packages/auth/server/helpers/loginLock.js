import { LOGIN_LOCK_TIME } from '../../isomorphic'

export default async function loginLock (userId, req, res) {
  const $auth = req.model.scope(`auths.${userId}`)
  await $auth.subscribe()
  await $auth.set('loginLockedTill', Date.now() + LOGIN_LOCK_TIME)

  $auth.unsubscribe()

  res.status(400).send({
    message: 'Your account has temporarily been locked due to failed login attempts. Try in 5 minute.'
  })
}
