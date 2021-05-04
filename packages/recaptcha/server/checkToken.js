import { checkEnterpriseToken as _checkEnterpriseToken, checkToken as _checkToken } from './helpers'

export default async function checkToken (options) {
  if (options.type === 'enterprise') {
    return _checkEnterpriseToken(options)
  } else {
    return _checkToken(options)
  }
}
