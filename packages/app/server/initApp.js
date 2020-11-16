export default function initApp (ee, { criticalVersion, criticalVersionMiddleware } = {}) {
  if (criticalVersion) {
    ee.on('middleware', expressApp => {
      if (!criticalVersionMiddleware) {
        criticalVersionMiddleware = (req, res, next) => {
          req.model.set('_session.criticalVersion', criticalVersion)
          next()
        }
      }
      expressApp.use(criticalVersionMiddleware)
    })
  }
  ee.on('routes', expressApp => {
    expressApp.get('/api/serverSession', function (req, res) {
      return res.json(req.model.get('_session'))
    })
  })
}
