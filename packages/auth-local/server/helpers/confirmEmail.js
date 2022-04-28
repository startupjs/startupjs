export default async function confirmEmail (model, userId, config, next) {
  const $auth = model.at('auths.' + userId)
  await $auth.subscribe()

  if (!$auth.get()) {
    return next('User is not registered')
  }

  if (!$auth.get('providers.local')) {
    return next('User is not registered with email/password')
  }

  const unconfirmed = $auth.get('providers.local.unconfirmed')

  if (!unconfirmed) {
    return next('User is already confirmed')
  }

  if (unconfirmed.expiresAt < Date.now()) {
    return next('Confirmation is expired')
  }

  $auth.del('providers.local.unconfirmed')
  next()
}
