import {
  LINKED_PROVIDER_ERROR,
  ACCOUNT_ALREADY_LINKED_ERROR,
  ACCOUNT_LINKED_INFO,
  ACCOUNT_ALREADY_LINKED_TO_ANOHER_PROFILE_ERROR,
  generateRedirectResponse
} from '../../isomorphic'

export default async function linkAccount (req, provider, goBackCount = 2) {
  const { model } = req

  const providerName = provider.getProviderName()
  const providerEmail = provider.getEmail()

  // get existingAccounts
  const $existingAccounts = model.query('auths', {
    [`providers.${providerName}.email`]: providerEmail
  })
  await model.subscribe($existingAccounts)
  const existingAccounts = $existingAccounts.get()

  // get current providers
  const $auth = model.scope('auths.' + req.session.userId)
  await model.subscribe($auth)
  const providers = $auth.get('providers')

  let responseText = ACCOUNT_LINKED_INFO

  // Return error if that account has already linked to another profile
  if (existingAccounts.length) {
    responseText = ACCOUNT_ALREADY_LINKED_TO_ANOHER_PROFILE_ERROR
  } else {
    if (providerName in providers) {
      if (providerEmail !== providers[providerName].email) {
        responseText = LINKED_PROVIDER_ERROR
      } else {
        responseText = ACCOUNT_ALREADY_LINKED_ERROR
      }
    } else {
      await $auth.set(
        'providers.' + providerName,
        provider.getAuthData().providers[providerName]
      )
    }
  }
  model.unsubscribe($existingAccounts, $auth)

  return generateRedirectResponse(responseText, 3000, goBackCount)
}
