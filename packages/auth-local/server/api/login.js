import passport from 'passport'

export default function localLogin (req, res, done) {
  passport.authenticate('local', function (err, userId, info) {
    if (err) {
      return done(err)
    }

    if (!userId) {
      return res.status(403).json(info || { message: 'auth error' })
    }

    req.login(userId, function () {
      res.json({ ...req.model.get('_session'), userId })
    })
  })(req, res, done)
}