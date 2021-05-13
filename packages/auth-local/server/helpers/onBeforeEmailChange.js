/**
 * @description This hook is triggering right before email change logic
 */
export default function onBeforeEmailChange (req, res, next) {
  console.log('\n[@dmapper/auth] Before email change hook', '\n')

  const { secret } = req.body
  const { userId, loggedIn } = req.session

  if (!userId || (userId && !loggedIn)) return next('Seems you aren\'t authorised')
  if (!secret) return next('Please provide email change secret')

  next(null, { secret, userId })
}
