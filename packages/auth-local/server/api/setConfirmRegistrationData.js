export default async function setConfirmRegistrationData (model, userId, confirmEmailTimeLimit) {
  const $auth = model.at(`auths.${userId}`)
  await $auth.subscribe()
  
  if (!$auth.get('providers.local')) {
    throw Error('User does not have local provider')
  }

  await $auth.set('providers.local.unconfirmed', {
    expiresAt: Date.now() + confirmEmailTimeLimit
  })

  $auth.unsubscribe()
}