import { checkDataEnterpriseToken, checkDataToken } from './helpers'

export default async function checkDataRecaptcha (params) {
  switch (params.type) {
    case 'enterprise':
      return await checkDataEnterpriseToken(params)
    case 'v3':
      return await checkDataToken(params)
  }
}
