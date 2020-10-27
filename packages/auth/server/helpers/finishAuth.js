export default function finishAuth (req, res, userId) {
  req.login(userId, function (err) {
    if (err) {
      res.status(403).send({ message: '[@startupjs/auth:finishAuth] Error: Auth failed', error: err })
    }
    res.send('[@startupjs/auth] Logged in. Refresh page to finish authenication.')
  })
}
