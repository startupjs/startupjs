import ensureAuthenticated from './ensureAuthenticated'

export default function (passport, router) {
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
