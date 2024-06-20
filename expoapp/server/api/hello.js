export function get (req, res) {
  const { userId } = req.user
  res.send('Hello from server. My id: ' + userId)
}
