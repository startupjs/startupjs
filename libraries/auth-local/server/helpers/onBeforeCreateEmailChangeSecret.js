import { EMAIL_REGEXP } from '../../isomorphic/constants.js'

/**
 * @description This hook is triggering before email change secret creation
 */
export default function onBeforeCreateEmailChangeSecret (req, res, done) {
  console.log('\n[@dmapper/auth] Before create email change secret hook', '\n')

  const { email, userId } = req.body

  if (!userId) return done('Missing userId')
  if (!email || !EMAIL_REGEXP.test(email)) {
    return done('Provide correct user email')
  }

  done(null, { email, userId })
}
