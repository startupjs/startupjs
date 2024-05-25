import TwoFAManagerConstructor from '../TwoFAManager.js'

export default function checkToken (model, session, { data = {}, providerName = '', token = '' }) {
  const TwoFAManager = new TwoFAManagerConstructor()

  const _providerName = data.twoFA
    ? data.twoFA.providerName
    : providerName

  const _token = data.twoFA
    ? data.twoFA.token
    : token

  return TwoFAManager.check(model, session, _token, _providerName)
}
