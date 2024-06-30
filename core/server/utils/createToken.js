import jwt from 'jsonwebtoken'
import getAppSecret from '../utils/getAppSecret.js'
export const TOKEN_EXPIRATION = '30d'
export const TOKEN_REISSUE_AFTER_SECONDS = 7 * 24 * 60 * 60 // 7 days

export default async function createToken (payload = {}) {
  if (!payload.userId) throw Error('Token payload must have at least a userId')
  return jwt.sign(
    payload,
    await getAppSecret(),
    { algorithm: 'HS256', expiresIn: TOKEN_EXPIRATION }
  )
}
