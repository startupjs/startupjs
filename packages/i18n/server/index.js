import routes from './routes'

export function initI18n (ee) {
  if (!ee) {
    throw new Error('[@startupjs/i18n] initI18n: ee is required')
  }

  ee.on('routes', routes)
}

export { default as getI18nRoutes } from './../client/app/routes'
