export default function onLoginFinishHook (data, req, res, next) {
  console.log('\n[@dmapper/auth] User finish login hook:', data, '\n')

  next()
}
