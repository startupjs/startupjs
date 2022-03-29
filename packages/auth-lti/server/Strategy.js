import { Strategy as LTIStrategy } from '@dmapper/passport-lms-lti'
import passport from 'passport'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'
import { getDbSchools } from './helpers'

function validateConfigs ({ schools, collectionName }) {
  if (!collectionName && !schools) {
    throw new Error('[@dmapper/auth-lti] Error: Provide schools or collection name')
  }
}

export default function (config = {}) {
  this.config = {}

  const func = async ({ model, router, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig,
      callbackUrl: CALLBACK_URL
    }, config)

    validateConfigs(this.config)

    const { collectionName } = this.config

    if (collectionName) {
      this.config.schools = async function() {
        return await getDbSchools(model, collectionName)
      }
    }

    const { schools, callbackUrl} = this.config

    initRoutes({ router, config: this.config })

    console.log('++++++++++ Initialization of LTI auth strategy ++++++++++\n')

    passport.use(new LTIStrategy({ schools, callbackUrl }))
  }

  func.providerName = 'lti'
  return func
}
