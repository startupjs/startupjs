import routes from './routes.js'
import TwoFAManager from './TwoFAManager.js'

export default function (ee, options) {
  const TwoFAManagerInstance = new TwoFAManager(ee, options)

  ee.on('afterSession', expressApp => {
    expressApp.use((req, res, next) => {
      const $session = req.model.scope('_session')
      $session.set('_2fa', { providerIds: TwoFAManagerInstance.getProviders() })
      next()
    })
  })

  ee.on('routes', routes)
}
