/**
 * @description This hook is triggering before passwod reset secret creation
 */
export default function onBeforeCreatePasswordResetSecret (req, res, done) {
  console.log('\n[@dmapper/auth] Create password reset secret hook', '\n')

  const { email } = req.body

  if (!email) return done('Missing email')

  done(null, email)
}
