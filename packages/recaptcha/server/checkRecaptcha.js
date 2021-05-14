import { checkEnterpriseToken, checkToken } from './helpers'

export default async function checkRecaptcha (params) {
  switch (params.type) {
    case 'enterprise':
      return await checkEnterpriseToken(params)
    case 'v3':
      return await checkToken(params)
  }
}
