import initRoutes from './api'
import initProviders from './providers/init'
import initTemplates from './initTemplates'
import initLayouts from './initLayouts'
export { default as initMailRoutes } from './api'
export { getProvider } from './providers'
export { registerTemplates } from './initTemplates'
export { registerLayouts } from './initLayouts'
/**
 * @param {String} options.defaultProvider name of provider will be used by default
 * @param {Object} options.providers providers settings
 * @param {Object} options.layouts layouts settings
*/

export default async function initMail (ee, options = {}) {
  if (!ee) {
    throw new Error('[@startupjs/mail] initMail: ee is required')
  }

  if (!options.providers) {
    throw new Error('[@startupjs/mail] initMail: no provider options passed!')
  }

  if (!options.templates) {
    throw new Error('[@startupjs/mail] initMail: no templates options passed!')
  }

  initProviders({
    defaultProvider: options.defaultProvider,
    providers: options.providers
  })

  initLayouts(options.layouts)
  initTemplates(options.templates)

  ee.on('routes', expressApp => {
    expressApp.use('/api', initRoutes())
  })
}
