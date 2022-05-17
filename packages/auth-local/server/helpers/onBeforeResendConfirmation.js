import {
  ERROR_EMAIL_REQUIRED,
  ERROR_USER_NOT_FOUND
} from '../../isomorphic'
import Provider from '../Provider'

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
