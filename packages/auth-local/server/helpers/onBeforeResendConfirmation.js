import { ERROR_EMAIL_REQUIRED } from '../../isomorphic/index.js'
import Provider from '../Provider.js'

export default async function onBeforeResendConfirmation (req, res, config, next) {
  const { email } = req.body
  if (!email) return next(ERROR_EMAIL_REQUIRED)

  const model = req.model

  const provider = new Provider(model, { email }, config)
  const auth = await provider.loadAuthData()

  if (!auth?.providers?.local?.confirmationExpiresAt) {
    return next('User is already confirmed')
  }

  next(null, auth.id)
}
