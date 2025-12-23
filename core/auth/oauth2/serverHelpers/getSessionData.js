import createToken from '../../server/createToken.js'

export default async function getSessionData (userId, { extraPayload, storage } = {}) {
  const user = await storage.getUserById(userId)
  const { auth } = user
  const authProviderIds = auth?.providerIds || []
  const payload = { userId, loggedIn: true, authProviderIds, ...extraPayload }
  const token = await createToken(payload)
  return { ...payload, token }
}
