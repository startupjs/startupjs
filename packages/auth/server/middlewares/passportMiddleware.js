import ensureAuthenticated from './ensureAuthenticated'
import passport from 'passport'

export default function (router) {
  return (req, res, next) => {
    passport.initialize()(req, res, err => {
      if (err) return next(err)
      passport.session()(req, res, err => {
        if (err) return next(err)
        ensureAuthenticated(req, res, () => {
          router.handle(req, res, err => {
            if (err) return next(err)
            next()
          })
        })
      })
    })
  }
}
