import checkToken from './checkToken'

export default function initDefaultRoutes (router) {
  router.post('/api/recaptcha-check-token', async function (req, res) {
    const { token } = req.body
    const data = await checkToken(token)
    res.status(200).send(data)
  })
}
