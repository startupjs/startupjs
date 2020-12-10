import { finishAuth } from '@startupjs/auth/server'
import crypto from 'crypto'
import Provider from '../Provider'
import { CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY } from '../../isomorphic'

export default async function loginNativeFinish (req, res, next, config) {
  const hash = req.body

  const decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

  const userAppleId = decrpyted.toString()
  const { successRedirectUrl, onBeforeLoginHook } = config

  const provider = new Provider(req.model, { id: userAppleId }, config)
  const userId = await provider.findOrCreateUser()

  finishAuth(req, res, { userId, successRedirectUrl, onBeforeLoginHook })
}
