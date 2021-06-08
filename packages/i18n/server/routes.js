import api from './api'

export default function i18nRoutesServer (expressApp) {
  expressApp.use('/api/i18n', api)
}
