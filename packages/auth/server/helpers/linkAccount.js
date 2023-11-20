import {
  LINKED_PROVIDER_ERROR,
  ACCOUNT_ALREADY_LINKED_ERROR,
  ACCOUNT_LINKED_INFO,
  ACCOUNT_ALREADY_LINKED_TO_ANOHER_PROFILE_ERROR,
  generateRedirectResponse
} from '../../isomorphic/index.js'

export default async function linkAccount (req, provider, goBackCount = 2) {
  const { model } = req

  const providerName = provider.getProviderName()
  const providerEmail = provider.getEmail()

  const $existingAccounts = model.query('auths', {
    [`providers.${providerName}.email`]: providerEmail
  })

  const $auth = model.scope('auths.' + req.session.userId)

  await model.subscribe($existingAccounts, $auth)

  const existingAccounts = $existingAccounts.get()
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
