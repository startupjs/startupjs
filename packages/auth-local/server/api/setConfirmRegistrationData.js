export default async function setConfirmRegistrationData (model, userId, confirmEmailTimeLimit) {
  const $auth = model.at(`auths.${userId}`)
  await $auth.subscribe()

  if (!$auth.get('providers.local')) {
    throw Error('User does not exist')
  }

  await $auth.set('providers.local.confirmationExpiresAt', Date.now() + confirmEmailTimeLimit)

  $auth.unsubscribe()
}
