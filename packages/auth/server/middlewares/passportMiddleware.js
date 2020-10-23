import passport from 'passport'
import { setAuthInfo } from '@startupjs/auth/server/middlewares'

export default function (router) {
  return (req, res, next) => {
    passport.initialize()(req, res, err => {
      if (err) return next(err)
      passport.session()(req, res, err => {
        if (err) return next(err)
        setAuthInfo(req, res, () => {
          router.handle(req, res, err => {
            if (err) return next(err)
            next()
          })
        })
      })
    })
  }
}
