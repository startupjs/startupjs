import { Strategy as LTIStrategy } from 'passport-idg-lti'
import passport from 'passport'
import initRoutes from './initRoutes'
import { CALLBACK_URL } from '../isomorphic'

function validateConfigs ({ schools, collectionName }) {
  if (!collectionName && !schools) {
    throw new Error('[@dmapper/auth-lti] Error: Provide schools or collection name')
  }
}

export default function (config = {}) {
  this.config = {}

  const func = async ({ router, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig,
      callbackUrl: CALLBACK_URL
    }, config)

    validateConfigs(this.config)

    const { schools, callbackUrl } = this.config

    initRoutes({ router, config: this.config })

    console.log('++++++++++ Initialization of LTI auth strategy ++++++++++\n')

    passport.use(new LTIStrategy({ schools, callbackUrl }))
  }

  func.providerName = 'lti'
  return func
}
