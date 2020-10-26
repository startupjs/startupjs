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
      // Prepare and send important session info from server session
      // Mobile devices can't update session info on app run
      // That info passes to client app right after app initialisation
      // Check app/client/index.js for background and usage
      const session = {
        ...req.model.get('_session'),
        userId: req.session.userId,
        loggedIn: req.session.loggedIn
      }
      return res.json(session)
    })
  })
}
