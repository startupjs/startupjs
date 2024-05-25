/**
 * @description This hook is triggering right before password reset logic
 */
export default function onBeforePasswordReset (req, res, next) {
  console.log('\n[@dmapper/auth] BEFORE password reset hook', '\n')
  const { secret, password, confirm } = req.body

  if (!secret) return next('Missing secret')
  if (!password) return next('Missing password')
  if (!confirm) return next('Missing password confirm')
  if (password !== confirm) return next('Password should match confirmation')

  next(null)
}
