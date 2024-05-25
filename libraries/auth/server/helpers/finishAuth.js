export default async function finishAuth (req, res, {
  userId,
  onBeforeLoginHook,
  onAfterLoginHook
}) {
  onBeforeLoginHook({ userId }, req, res, () => {
    const authRedirectUrl = req.cookies.authRedirectUrl || '/'
    res.clearCookie('authRedirectUrl')

    req.login(userId, async function (err) {
      if (err) {
        res.status(403).send({ message: '[@startupjs/auth] Error: Auth failed', error: err })
      }

      if (userId) {
        await setLastLogin(userId, req.model)

        if (onAfterLoginHook) {
          const hookRes = onAfterLoginHook(userId)
          hookRes && hookRes.then && await hookRes
        }
      }

      res.redirect(authRedirectUrl)
    })
  })
}

async function setLastLogin (userId, model) {
  const $auth = model.scope(`auths.${userId}`)
  await $auth.subscribe()

  await $auth.set('lastLogin', Date.now())
  // Remove loginLockedTill after success login
  await $auth.del('loginLockedTill')

  $auth.unsubscribe()
}
