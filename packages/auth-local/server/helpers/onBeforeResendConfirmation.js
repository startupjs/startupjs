import {
  ERROR_EMAIL_REQUIRED,
  ERROR_USER_NOT_FOUND 
} from '../../isomorphic'

export default async function onBeforeResendConfirmation (req, res, next) {
  const { email } = req.body
  if (!email) return next(ERROR_EMAIL_REQUIRED)

  const model = req.model

  const $$auths = model.query('auths', { email })
  await $$auths.subscribe()
  const auths = $$auths.get()

  if (!auths.length) return next(ERROR_USER_NOT_FOUND)

  const auth = auths[0]

  if (!auth.providers.local?.unconfirmed) {
    return next('Service is not available for this user')
  }

  next(null, auth.id)
}
