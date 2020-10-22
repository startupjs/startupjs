import { LOGOUT_URL } from '../isomorphic/constants'

export default function initDefaultRoutes (router) {
  router.get(LOGOUT_URL, function (req, res) {
    delete req.session.loggedIn
    delete req.session.userId
    req.logout()
    res.redirect('/')
  })
}