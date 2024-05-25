import { checkEnterpriseToken, checkToken } from './helpers/index.js'

export default async function checkRecaptcha (params) {
  switch (params.type) {
    case 'enterprise':
      return await checkEnterpriseToken(params)
    case 'v3':
      return await checkToken(params)
  }
}
