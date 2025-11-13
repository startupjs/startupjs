import bcrypt from 'bcrypt'
import getSessionData from '../../serverHelpers/getSessionData.js'
import { getPublicError } from '../../serverHelpers/publicError.js'
import { beforeLogin } from '../../serverHelpers/hooks.js'
import { getRedirectUrlFromError } from '../../serverHelpers/redirect.js'
import { getProviderConfig } from '../../serverHelpers/providers.js'

export default ({ providers, storage, provider }) => async (req, res) => {
  try {
    let { email, password } = req.body || {}
    if (!(typeof email === 'string' && typeof password === 'string')) {
      return res.json({ error: { message: 'Email and password are required' } })
    }
    email = email.trim().toLowerCase()
    password = password.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.json({ error: { message: 'Email is invalid' } })
    }

    const user = await storage.findUserByProvider(provider, email, storage.getUsersFilterQueryParams())
    const wrongCredentialsError = { error: { message: 'Login or password are incorrect' } }
    if (!user) return res.json(wrongCredentialsError)
    const token = user.auth[provider].token
    const passwordMatch = await bcrypt.compare(password, token)
    if (!passwordMatch) return res.json(wrongCredentialsError)
    const config = getProviderConfig(providers, provider)

    // run hooks
    await beforeLogin({ $auth: user.$auth, config, provider, userId: user.userId })

    // login
    const session = await getSessionData(user.userId, { storage })
    res.json({ session })
  } catch (err) {
    console.warn(`User auth error (${provider}) login:`, err)
    const redirectUrl = getRedirectUrlFromError(err)

    if (redirectUrl) return res.json({ error: { redirectUrl } })

    const publicError = getPublicError(err, 'Error during login. Please try again later.')
    res.json({ error: { message: publicError } })
  }
}
