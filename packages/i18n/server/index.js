import routes from './routes'

export function initI18n (ee, config) {
  if (!ee) {
    throw new Error('[@startupjs/i18n] initI18n: ee is required')
  }

  ee.on('routes', routes)

  ee.on('middleware', expressApp => {
    expressApp.use((req, res, next) => {
      const lang = req.session.lang
      if (lang) req.model.set('_session.lang', lang)
      next()
    })
  })
}
