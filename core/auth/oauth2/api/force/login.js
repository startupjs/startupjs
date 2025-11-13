import { getProviderConfig } from '../../serverHelpers/providers.js'
import getSessionData from '../../serverHelpers/getSessionData.js'
import { getPublicError } from '../../serverHelpers/publicError.js'
import { getRedirectUrlFromError } from '../../serverHelpers/redirect.js'

export default ({ providers, storage, provider }) => async (req, res) => {
  try {
    const { userId: targetUserId } = req.body
    if (typeof targetUserId !== 'string') return res.json({ error: { message: 'User ID is required' } })
    const config = getProviderConfig(providers, provider)
    const { validateAccess } = config
    const { session } = req
    if (!session.loggedIn) return res.json({ error: { message: 'You are not logged in' } })
    const targetAuthData = await storage.getUserById(targetUserId)
    if (!targetAuthData) return res.json({ error: { message: 'No user found with userId ' + targetUserId } })
    await validateAccess({ session, targetUserId, config, provider, storage })

    // login
    const targetSession = await getSessionData(targetUserId, {
      extraPayload: {
        isImpostor: true,
        impostorUserId: session.userId
      },
      storage
    })
    res.json({ session: targetSession })
  } catch (err) {
    console.warn(`User auth error (${provider}):`, err)
    const redirectUrl = getRedirectUrlFromError(err)

    if (redirectUrl) return res.json({ error: { redirectUrl } })

    const publicError = getPublicError(err, 'Error during login. Please try again later.')
    res.json({ error: { message: publicError } })
  }
}
