/**
 * @description To prevent brute-forece attacks we added loginLockedTill property with expire date
 * That property block all future logins for specifiic period (60 sec) and send error message to client
 * You can find more logic in '../heplers/loginLock'
 */
import Provider from '../Provider.js'

export default function loginLockChecker (config) {
  return async function (req, res, next) {
    const { model, body } = req
    const provider = new Provider(model, { email: body.email }, config)
    const auth = await provider.loadAuthData()

    if (auth) {
      const now = Date.now()

      const { loginLockedTill = 0 } = auth
      const lockTime = Math.ceil((loginLockedTill - now) / (1000 * 60))

      if (loginLockedTill - now > 0) {
        return res.status(400).send({
          message: `Your account has temporarily been locked due to failed login attempts. Try in ${lockTime} minutes.`
        })
      } else {
        const $auth = model.scope(`auths.${auth.id}`)
        await $auth.subscribe()
        await $auth.del('loginLockedTill')
        $auth.unsubscribe()
      }
    }

    next()
  }
}
