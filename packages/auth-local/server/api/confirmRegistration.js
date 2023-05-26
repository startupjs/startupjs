import { sendError, ERROR_FORMAT_REDIRECT } from '../helpers'

export default function confirmRegistration (config) {
  return function (req, res) {
    const {
      registrationConfirmedUrl,
      confirmEmail,
      onBeforeConfirmRegistration,
      sendRegistrationConfirmationComplete
    } = config

    onBeforeConfirmRegistration(req, res, function (err, userId) {
      if (err) return _sendError(err)

      sendRegistrationConfirmationComplete(userId, function (err) {
        if (err) return _sendError(err)

        confirmEmail(req.model, userId, config, function (err) {
          if (err) return _sendError(err)

          res.redirect(registrationConfirmedUrl)
        })
      })
    })

    function _sendError (err) {
      sendError(res, err, { type: ERROR_FORMAT_REDIRECT })
    }
  }
}
