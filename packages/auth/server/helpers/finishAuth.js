export default async function finishAuth (req, res, { userId, successRedirectUrl, onLoginFinishHook, onLoginStartHook }) {
  onLoginStartHook({ userId }, req, res, () => {
    req.login(userId, function (err) {
      if (err) {
        res.status(403).send({ message: '[@startupjs/auth] Error: Auth failed', error: err })
      }

      onLoginFinishHook({ userId }, req, res, () => {
        res.redirect(successRedirectUrl)
      })
    })
  })
}
