export default async function confirmEmail (model, userId, config, next) {
  const $auth = model.at('auths.' + userId)
  await $auth.subscribe()

  if (!$auth.get()) {
    return next('User is not registered')
  }

  if (!$auth.get('providers.local')) {
    return next('User is not registered with email/password')
  }

  const confirmEmail = $auth.get('providers.local.confirmEmail')
  const unconfirmed = $auth.get('providers.local.unconfirmed')

  if (!confirmEmail || !unconfirmed) {
    return next()
  }

  if (confirmEmail.expiresAt < Date.now()) {
    return next('Confirmation is expired')
  }

  $auth.del('providers.local.unconfirmed')
  $auth.del('providers.local.confirmEmail')
  next()
}
