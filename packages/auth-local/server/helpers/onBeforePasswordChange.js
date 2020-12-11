/**
 * @description This hook is triggering right before password change logic
 */
export default function onBeforePasswordChange (req, res, next) {
  console.log('\n[@dmapper/auth] BEFORE password change hook', '\n')

  const { oldPassword, password, confirm } = req.body
  const { userId, loggedIn } = req.session

  if (!userId || (userId && !loggedIn)) return next("Seems you aren't authorised")
  if (!oldPassword) return next('Please fill old password')
  if (!password) return next('Please fill password')
  if (!confirm) return next('Please fill password confirmation')
  if (password !== confirm) return next('Password should match confirmation')

  next(null)
}
