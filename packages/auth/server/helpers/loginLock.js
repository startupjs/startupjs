import { LOGIN_LOCK_MINUTES } from '../../isomorphic/index.js'

export default async function loginLock (userId, req, res) {
  const $auth = req.model.scope(`auths.${userId}`)
  await $auth.subscribe()
  await $auth.set(
    'loginLockedTill',
    Date.now() + LOGIN_LOCK_MINUTES * 60 * 1000
  )

  $auth.unsubscribe()

  res.status(400).send({
    message: `Your account has temporarily been locked due to failed login attempts. Try in ${LOGIN_LOCK_MINUTES} minute.`
  })
}
