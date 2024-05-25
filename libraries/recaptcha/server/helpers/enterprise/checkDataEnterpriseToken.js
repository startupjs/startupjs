import axios from 'axios'
import nconf from 'nconf'

export default async function checkEnterpriseToken ({ token, variant }) {
  const RECAPTCHA_SECRET_KEY = nconf.get('RECAPTCHA_SECRET_KEY')
  const ENTERPRISE_NORMAL_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_NORMAL_SITE_KEY')
  const ENTERPRISE_INVISIBLE_SITE_KEY = nconf.get('RECAPTCHA_ENTERPRISE_INVISIBLE_SITE_KEY')
  const GOOGLE_CLOUD_PROJECT_ID = nconf.get('GOOGLE_CLOUD_PROJECT_ID')

  const { data } = await axios.post(
    `https://recaptchaenterprise.googleapis.com/v1beta1/projects/${GOOGLE_CLOUD_PROJECT_ID}/assessments?key=${RECAPTCHA_SECRET_KEY}`,
    {
      event: {
        token,
        siteKey: variant === 'normal' ? ENTERPRISE_NORMAL_SITE_KEY : ENTERPRISE_INVISIBLE_SITE_KEY
      }
    }
  )

  return data
}
