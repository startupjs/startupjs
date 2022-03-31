import { Strategy as LTIStrategy } from '@dmapper/passport-lms-lti'
import passport from 'passport'
import initRoutes from './initRoutes'
import { CALLBACK_URL, DB_COLLECTION_NAME } from '../isomorphic'
import { getDbSchools } from './helpers'

function validateConfigs ({ schools, collectionName, dbSchools }) {
  if ((dbSchools && !collectionName) || (!dbSchools && !schools)) {
    throw new Error('[@dmapper/auth-lti] Error: Provide schools or collection name')
  }
}

export default function (config = {}) {
  this.config = {}

  const func = async ({ model, router, authConfig }) => {
    Object.assign(this.config, {
      ...authConfig,
      callbackUrl: CALLBACK_URL,
      collectionName: DB_COLLECTION_NAME,
      dbSchools: false
    }, config)

    validateConfigs(this.config)

    const { dbSchools, collectionName } = this.config

    if (dbSchools && collectionName) {
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
