import nconf from 'nconf'

export default function setRecaptchaSiteKey (req, res, next) {
  const $session = req.model.scope('_session')

  const RECAPTCHA_SITE_KEY = nconf.get('RECAPTCHA_SITE_KEY')
  const recaptchaSecretKeyExists = !!nconf.get('RECAPTCHA_SECRET_KEY')

  if (!RECAPTCHA_SITE_KEY) {
    console.warn('\x1b[33m%s\x1b[0m', '[@startupjs/recaptcha] WARNING: The "RECAPTCHA_SITE_KEY" field in config.json is missing')
  }

  if (!recaptchaSecretKeyExists) {
    console.warn('\x1b[33m%s\x1b[0m', '[@startupjs/recaptcha] WARNING: The "RECAPTCHA_SECRET_KEY" field in config.json is missing')
  }

  try {
    $session.set('Recaptcha.RECAPTCHA_SITE_KEY', RECAPTCHA_SITE_KEY)
    $session.set('Recaptcha.recaptchaSecretKeyExists', recaptchaSecretKeyExists)
  } catch (err) {
    return next(err)
  }

  next()
}
