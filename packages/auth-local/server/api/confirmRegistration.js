export default function confirmRegistration (config) {
  return function (req, res) {
    const {
      registrationConfirmedUrl,
      confirmEmail,
      onBeforeConfirmRegistration,
      sendRegistrationConfirmationComplete,
    } = config

    onBeforeConfirmRegistration(req, res, function(err, userId) {
      if (err) return res.send(err)

      sendRegistrationConfirmationComplete(userId, function(err){
        if (err) return res.send(err)

        confirmEmail(req.model, userId, config, function(err) {
          if (err) return res.send(err)

          req.login(userId, function () {
            res.redirect(registrationConfirmedUrl)
          })
        })
      })
    })
  }
}
