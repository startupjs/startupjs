import { EMAIL_REGEXP } from '../../isomorphic/index.js'

/**
 * @description This hook is triggering right before user register
 * You can validate register data here
 */
export default function onBeforeRegister (req, res, next, opts) {
  console.log('\n[@dmapper/auth] BEFORE user register hook', '\n')

  const { emailRegistrationRegexp } = opts

  const email = (req.body.email || '').toLowerCase()
  const password = req.body.password
  const confirm = req.body.confirm

  if (!email) {
    return next('Please fill email')
  }

  if (!password) {
    return next('Please fill password')
  }

  if (!confirm) {
    return next('Please fill password confirmation')
  }

  if (password !== confirm) {
    return next('Password should match confirmation')
  }

  if (password.length < 8) {
    return next('Password length should be at least 8')
  }

  if (!EMAIL_REGEXP.test(email)) {
    return next('Incorrect email')
  }

  if (emailRegistrationRegexp && !emailRegistrationRegexp.test(email)) {
    return next("You can't use this email")
  }

  const userData = {}

  next(null, userData)
}
