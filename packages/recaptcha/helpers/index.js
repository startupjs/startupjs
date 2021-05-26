import { $root } from 'startupjs'

const isEnterprise = () => $root.get('_session.Recaptcha.type') === 'enterprise'

const getSiteKey = variant => {
  const recaptchaSiteKey = $root.get('_session.Recaptcha.SITE_KEY')
  const enterpriseNormalSiteKey = $root.get('_session.Recaptcha.ENTERPRISE_NORMAL_SITE_KEY')
  const enterpriseInvisibleSiteKey = $root.get('_session.Recaptcha.ENTERPRISE_INVISIBLE_SITE_KEY')

  if (isEnterprise()) { return variant === 'invisible' ? enterpriseInvisibleSiteKey : enterpriseNormalSiteKey }
  return recaptchaSiteKey
}

const isReady = () => {
  if (isEnterprise()) {
    return Boolean(typeof window === 'object' && window?.grecaptcha?.enterprise?.render)
  }
  return Boolean(typeof window === 'object' && window?.grecaptcha?.render)
}

const getGrecaptcha = () => {
  return isEnterprise() ? window.grecaptcha.enterprise : window.grecaptcha
}

const getRecaptchaType = () => {
  return isEnterprise() ? 'enterprise' : 'v3'
}

const getIframeUrl = () => {
  return isEnterprise()
    ? 'google.com/recaptcha/enterprise'
    : 'google.com/recaptcha/api2/bframe'
}

const grecaptchaAsString = isEnterprise() ? 'window.grecaptcha.enterprise' : 'window.grecaptcha'

export {
  getSiteKey,
  isReady,
  getGrecaptcha,
  getRecaptchaType,
  getIframeUrl,
  grecaptchaAsString
}
