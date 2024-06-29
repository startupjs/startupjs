export function get (req, res) {
  const { userId } = req.session
  res.send('Hello from server. My id: ' + userId)
}
