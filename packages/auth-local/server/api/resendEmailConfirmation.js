import { setConfirmRegistrationData } from '../api/index.js'
import { sendError } from '../helpers/index.js'

export default function resendEmailConfirmation (config) {
  return async function (req, res) {
    const { sendRegistrationConfirmation, onBeforeResendConfirmation } = config

    onBeforeResendConfirmation(req, res, config, async function (err, userId) {
      if (err) return sendError(res, err)

      try {
        await setConfirmRegistrationData(
          req.model,
          userId,
          config.confirmEmailTimeLimit
        )
      } catch (e) {
        return sendError(res, e.message, { statusCode: 403 })
      }

      sendRegistrationConfirmation(req, userId, function (err) {
        if (err) return sendError(res, err)

        res.json(true)
      })
    })
  }
}
