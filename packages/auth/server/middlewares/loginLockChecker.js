/**
 * @description To prevent brute-forece attacks we added loginLockedTill property with expire date
 * That property block all future logins for specifiic period (60 sec) and send error message to client
 * You can find more logic in '../heplers/loginLock'
 */

export default async function loginLockChecker (req, res, next) {
  const { model, body } = req

  const $auths = model.query('auths', { email: body.email })
  await $auths.subscribe()
  const authDoc = $auths.get()[0]
  $auths.unsubscribe()

  if (authDoc) {
    const now = Date.now()

    const lockTime = Math.floor((authDoc.loginLockedTill - now) / 1000)

    if (authDoc.loginLockedTill - now > 0) {
      return res.status(400).send({
        message: `Your account has temporarily been locked due to failed login attempts. Try in ${lockTime} seconds.`
      })
    } else {
      const $auth = model.scope(`auths.${authDoc.id}`)
      await $auth.subscribe()
      await $auth.del('loginLockedTill')
      $auth.unsubscribe()
    }
  }

  next()
}
