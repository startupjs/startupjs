import axios from 'axios'
import nconf from 'nconf'
import { ENTERPRISE_ERRORS } from '../../constants.js'

export default async function checkEnterpriseToken ({ token, variant }) {
  const RECAPTCHA_SECRET_KEY = nconf.get('RECAPTCHA_SECRET_KEY')
  const ENTERPRISE_NORMAL_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_NORMAL_SITE_KEY')
  const ENTERPRISE_INVISIBLE_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_INVISIBLE_SITE_KEY')
  const GOOGLE_CLOUD_PROJECT_ID = nconf.get('GOOGLE_CLOUD_PROJECT_ID')
  const THRESHOLD = 0.3 // TODO: Get THRESHOLD from options in initRecaptcha

  const { data } = await axios.post(
    `https://recaptchaenterprise.googleapis.com/v1beta1/projects/${GOOGLE_CLOUD_PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`,
    {
      event: {
        token,
        siteKey: variant === 'normal' ? ENTERPRISE_NORMAL_SITE_KEY : ENTERPRISE_INVISIBLE_SITE_KEY
      }
    }
  )

  if (!data.tokenProperties.valid) {
    console.error(`[@startupjs/recaptcha]: ${ENTERPRISE_ERRORS[data.tokenProperties.invalidReason]}`)
  }

  return data.score >= THRESHOLD
}
