export default function sessionMiddleware (req, res, next) {
  const restoreUrl = req.session.restoreUrl
  if (!restoreUrl) return next()
  delete req.session.restoreUrl
  req.model.set('_session.restoreUrl', restoreUrl)
  next()
}
