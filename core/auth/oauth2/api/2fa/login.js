import { getProviderConfig } from '../../serverHelpers/providers.js'
import getSessionData from '../../serverHelpers/getSessionData.js'
import { beforeLogin } from '../../serverHelpers/hooks.js'
import { getPublicError } from '../../serverHelpers/publicError.js'

export default ({ providers, provider, storage }) => async (req, res) => {
  try {
    const { secret, code } = req.body
    if (!secret) return res.status(400).send('Secret is missing')
    if (!code) return res.status(400).send('Code is missing')

    const user = await storage.findUserBySecret(provider, secret)
    if (!user) return res.json({ error: { message: 'Secret is invalid' } })

    const config = getProviderConfig(providers, provider)
    const { verify, duration, numberOfDigits } = config
    const { $auth, userId } = user
    const isVerified = await verify({ userId, code, duration, numberOfDigits, storage })
    if (!isVerified) return res.json({ error: { message: 'Code is invalid' } })

    // run hooks
    await beforeLogin({ $auth, config, provider, userId })

    // login
    const session = await getSessionData(userId, { storage })
    res.json({ session })
  } catch (err) {
    console.warn(`User auth error (${provider}):`, err)

    const publicError = getPublicError(err, 'Error during login. Please try again later.')
    res.json({ error: { message: publicError } })
  }
}
