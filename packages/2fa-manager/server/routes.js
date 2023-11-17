import express from 'express'
import { GET_PROVIDERS_URL, SEND_URL, CHECK_URL } from '../isomorphic/index.js'
import TwoFAManager from './TwoFAManager.js'

const router = express.Router()

router.post(CHECK_URL, async (req, res) => {
  try {
    const isValid = await new TwoFAManager().check(req.model, req.session, req.body.token, req.body.providerName)
    res.status(200).send(isValid)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

router.post(SEND_URL, async (req, res) => {
  try {
    await new TwoFAManager().send(req.model, req.session, req.body.providerName)
    res.status(200).end()
  } catch (err) {
    res.status(400).send(err.message)
  }
})

router.get(GET_PROVIDERS_URL, (req, res) => {
  try {
    const providers = new TwoFAManager().getProviders()
    res.status(200).send(providers)
  } catch (err) {
    res.status(400).send(err.message)
  }
})

export default function (expressApp) {
  expressApp.use(router)
}
