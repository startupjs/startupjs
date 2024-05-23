import { EMAIL_REGEXP } from '../../isomorphic/constants.js'
/**
 * @description This hook is triggering before passwod reset secret creation
 */
export default function onBeforeCreatePasswordResetSecret (req, res, done) {
  console.log('\n[@dmapper/auth] Create password reset secret hook', '\n')

  const { email } = req.body

  if (!email) return done('Please enter an email address')
  if (!EMAIL_REGEXP.test(email)) return done('Please enter a valid email')

  done(null, email)
}
