export default async function confirmEmail (model, userId, config, next) {
  const $auth = model.at('auths.' + userId)
  await $auth.subscribe()

  if (!$auth.get()) {
    return next('User is not registered')
  }

  if (!$auth.get('providers.local')) {
    return next('User is not registered with email/password')
  }

  const confirmationExpiresAt = $auth.get('providers.local.confirmationExpiresAt')

  if (!confirmationExpiresAt) {
    return next('User is already confirmed')
  }

  if (confirmationExpiresAt < Date.now()) {
    return next('Confirmation is expired')
  }

  $auth.del('providers.local.confirmationExpiresAt')
  next()
}
