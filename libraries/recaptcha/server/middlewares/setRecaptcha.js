import nconf from 'nconf'

export default function setRecaptcha (options) {
  return (req, res, next) => {
    const $session = req.model.scope('_session')
    $session.setEach('Recaptcha', options)

    switch (options.type) {
      case 'enterprise': {
        const ENTERPRISE_NORMAL_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_NORMAL_SITE_KEY')
        const ENTERPRISE_INVISIBLE_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_INVISIBLE_SITE_KEY')

        if (!ENTERPRISE_NORMAL_SITE_KEY && !ENTERPRISE_INVISIBLE_SITE_KEY) {
          console.warn('\x1b[33m%s\x1b[0m', '[@startupjs/recaptcha] WARNING: The "RECAPTCHA_ENTERPRISE_*_SITE_KEY" field in config.json is missing')
        }

        try {
          ENTERPRISE_NORMAL_SITE_KEY && $session.set('Recaptcha.ENTERPRISE_NORMAL_SITE_KEY', ENTERPRISE_NORMAL_SITE_KEY)
          ENTERPRISE_INVISIBLE_SITE_KEY && $session.set('Recaptcha.ENTERPRISE_INVISIBLE_SITE_KEY', ENTERPRISE_INVISIBLE_SITE_KEY)
        } catch (err) {
          return next(err)
        }
        return next() }
      case 'v3': {
        const RECAPTCHA_SITE_KEY = nconf.get('RECAPTCHA_SITE_KEY')

        if (!RECAPTCHA_SITE_KEY) {
          console.warn('\x1b[33m%s\x1b[0m', '[@startupjs/recaptcha] WARNING: The "RECAPTCHA_SITE_KEY" field in config.json is missing')
        }

        try {
          $session.set('Recaptcha.SITE_KEY', RECAPTCHA_SITE_KEY)
        } catch (err) {
          return next(err)
        }

        return next()
      }
    }
  }
}
