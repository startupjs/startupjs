export default function isLoggedIn (req, res, next) {
  const loggedIn = req.isAuthenticated()
  if (loggedIn) {
    next()
  } else {
    console.log('[@dmapper/auth] Attempt to make not authorised request')
    res.status(403).json({ message: 'Access denied' })
  }
}
