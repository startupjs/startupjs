export default function initApp (ee, { criticalVersion } = {}) {
  if (criticalVersion) {
    ee.on('middleware', expressApp => {
      expressApp.use(function (req, res, next) {
        req.model.set('_session.criticalVersion', criticalVersion)
        next()
      })
    })
  }
  ee.on('routes', expressApp => {
    expressApp.get('/api/serverSession', function (req, res) {
      return res.json(req.model.get('_session'))
    })
  })
}
