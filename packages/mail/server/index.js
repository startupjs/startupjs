import mailApi from './api'
import initProviders from './providers/initProviders'
import initTemplates from './initTemplates'
import initLayouts from './initLayouts'
export { default as initMailRoutes } from './api'
export { getProvider, BaseMailProvider } from './providers'
export { default as sendEmail } from '../send'

/**
 * @param {String} options.defaultProvider name of provider will be used by default
 * @param {Object} options.providers providers settings
 * @param {Object} options.layouts layouts settings
*/

export default async function initMail (ee, options = {}) {
  if (!ee) {
    throw new Error('[@startupjs/mail] initMail: ee is required')
  }

  initProviders(options)

  initLayouts(options.layouts)

  if (options.templates) {
    initTemplates(options.templates)
  }

  ee.on('routes', expressApp => {
    expressApp.use('/api/mail', mailApi)
  })
}
