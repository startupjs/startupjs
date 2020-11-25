export default function onLoginStartHook (data, req, res, next) {
  console.log('\n[@dmapper/auth] User start login hook:', data, '\n')

  next()
}
