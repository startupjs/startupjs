import jwt from 'jsonwebtoken'
import getAppSecret from '../utils/getAppSecret.js'
const TOKEN_EXPIRATION = '1d'

export default async function createToken (payload = {}) {
  if (!payload.userId) throw Error('Token payload must have at least a userId')
  return jwt.sign(
    payload,
    await getAppSecret(),
    { algorithm: 'HS256', expiresIn: TOKEN_EXPIRATION }
  )
}
