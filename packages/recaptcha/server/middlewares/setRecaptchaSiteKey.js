import nconf from 'nconf'

export default function setRecaptchaSiteKey (req, res, next) {
  const $session = req.model.scope('_session')

  const RECAPTCHA_SITE_KEY = nconf.get('RECAPTCHA_SITE_KEY')

  try {
    $session.set('Recaptcha.RECAPTCHA_SITE_KEY', RECAPTCHA_SITE_KEY)
  } catch (err) {
    return next(err)
  }

  next()
}
