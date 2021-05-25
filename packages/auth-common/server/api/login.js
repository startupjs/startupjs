import passport from 'passport'

export default async function login (req, res, next, config) {
  passport.authenticate(config.providerName)(req, res, next)
}
