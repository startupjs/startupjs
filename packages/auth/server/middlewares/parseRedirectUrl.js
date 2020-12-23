export default function parseRedirectUrl (req, res, next) {
  if (req.method === 'GET') {
    const urlWithoutQuery = req.path
    const { redirectUrl } = req.query

    if (!redirectUrl) return next()
    // Save redirectUrl param to session
    // We'll redirect after success auth
    req.session.redirectUrl = redirectUrl

    return res.redirect(urlWithoutQuery)
  }

  next()
}
