export default function finishAuth (req, res) {
  const userId = req.session.passport.user
  req.login(userId, function () {
    res.send('[@startupjs/auth] Logged in. Refresh page to finish authenication.')
  })
}
