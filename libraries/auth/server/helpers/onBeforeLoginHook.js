/**
 * @description This hook is triggering right before login operation
 * You can controll login process that implemented in base { next } callback
 */
export default function onBeforeLoginHook ({ userId }, req, res, next) {
  console.log('\n[@dmapper/auth] BEFORE login hook:', userId, '\n')

  if (userId) {
    next()
  } else {
    res.status(403).send({ message: 'The email or password you entered is incorrect' })
  }
}
