import bcrypt from 'bcrypt'
import getSessionData from '../../serverHelpers/getSessionData.js'
import { afterRegister, beforeLogin } from '../../serverHelpers/hooks.js'
import { getPublicError } from '../../serverHelpers/publicError.js'
import { getRedirectUrlFromError } from '../../serverHelpers/redirect.js'
import getOrCreateAuth from '../../serverHelpers/getOrCreateAuth.js'
import { getProviderConfig } from '../../serverHelpers/providers.js'

export default ({ providers, storage, provider }) => async (req, res) => {
  try {
    const userinfo = JSON.parse(JSON.stringify(req.body || {}))
    if (!(typeof userinfo?.email === 'string' && typeof userinfo?.password === 'string')) {
      return res.json({ error: { message: 'Email and password are required' } })
    }
    userinfo.email = userinfo.email.trim().toLowerCase()
    userinfo.password = userinfo.password.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userinfo.email)) {
      return res.json({ error: { message: 'Email is invalid' } })
    }
    const existingAuth = await storage.findUserByProvider(provider, userinfo.email, storage.getUsersFilterQueryParams())
    if (existingAuth) return res.json({ error: { message: 'User with this email already exists' } })
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(userinfo.password)) {
      return res.json({
        error: {
          message: 'Password has to be at least 8 characters long and ' +
            'contain at least one number, one lowercase and one uppercase letter'
        }
      })
    }
    if (typeof userinfo.confirmPassword === 'string') {
      userinfo.confirmPassword = userinfo.confirmPassword.trim()
      if (userinfo.password !== userinfo.confirmPassword) {
        return res.json({ error: { message: 'Confirm password does not match' } })
      }
    }
    const token = await bcrypt.hash(userinfo.password, 10) // hash password before saving
    delete userinfo.password
    delete userinfo.confirmPassword
    const config = getProviderConfig(providers, provider)
    const state = userinfo.state
    if (state) delete userinfo.state

    const { userId, registered, $auth } = await getOrCreateAuth(config, provider, { userinfo, token, storage })
    // run hooks
    if (registered) await afterRegister({ $auth, config, provider, userId, state })
    await beforeLogin({ $auth, config, provider, userId })

    // login
    const session = await getSessionData(userId, { storage })
    res.json({ session })
  } catch (err) {
    console.warn(`User auth error (${provider}) register:`, err)
    const redirectUrl = getRedirectUrlFromError(err)

    if (redirectUrl) return res.json({ error: { redirectUrl } })

    const publicError = getPublicError(err, 'Error during registration. Please try again later')
    res.json({ error: { message: publicError } })
  }
}
