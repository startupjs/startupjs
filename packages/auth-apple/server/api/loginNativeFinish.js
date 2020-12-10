import { finishAuth } from '@startupjs/auth/server'
import Provider from '../Provider'

export default async function loginNativeFinish (req, res, next, config) {
  const { userAppleId } = req.query
  const { successRedirectUrl, onBeforeLoginHook } = config

  const provider = new Provider(req.model, { id: userAppleId }, config)
  const userId = await provider.findOrCreateUser()

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}
