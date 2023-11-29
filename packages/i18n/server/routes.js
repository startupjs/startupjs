import api from './api/index.js'

export default function i18nRoutesServer (expressApp) {
  expressApp.use('/api/i18n', api)
}
