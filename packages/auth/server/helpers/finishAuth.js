export default async function finishAuth (req, res, { userId, successRedirectUrl, onBeforeLoginHook, onAfterLoginHook }) {
  onBeforeLoginHook({ userId }, req, res, () => {
    req.login(userId, async function (err) {
      if (err) {
        res.status(403).send({ message: '[@startupjs/auth] Error: Auth failed', error: err })
      }

      if (userId) {
        await setLastLogin(userId, req.model)
        onAfterLoginHook && onAfterLoginHook(userId)
      }

      res.redirect(successRedirectUrl)
    })
  })
}

async function setLastLogin (userId, model) {
  const $auth = model.scope(`auths.${userId}`)
  await $auth.subscribe()

  await $auth.set('lastLogin', Date.now())
  // + remove loginLockedTill after success login
  await $auth.del('loginLockedTill')

  $auth.unsubscribe()
}
