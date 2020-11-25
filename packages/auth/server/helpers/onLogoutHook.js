export default function onLogoutHook (data, req, res, next) {
  console.log('\n[@dmapper/auth] User logged out:', data, '\n')

  next()
}
