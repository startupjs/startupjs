import { createOrUpdateSecret, checkToken, getSecret } from './helpers/index.js'
import { GET_SECRET_URL, CHECK_TOKEN_URL, CREATE_SECRET_URL } from '../isomorphic/constants.js'

export default function initDefaultRoutes (router, options) {
  router.get(CREATE_SECRET_URL, async function (req, res) {
    try {
      const secret = await createOrUpdateSecret(req.model, req.session, options)
      res.status(200).send(secret)
    } catch (err) {
      console.error(`${CREATE_SECRET_URL} error: `, err)
      res.status(400).send(err.message)
    }
  })

  router.get(GET_SECRET_URL, async function (req, res) {
    try {
      const secret = await getSecret(req.model, req.session)
      res.status(200).send(secret)
    } catch (err) {
      console.error(`${GET_SECRET_URL} error: `, err)
      res.status(400).send(err.message)
    }
  })

  router.post(CHECK_TOKEN_URL, async function (req, res) {
    const { token } = req.body
    const isValid = await checkToken(req.model, req.session, token)
    res.status(200).send(isValid)
  })
}
