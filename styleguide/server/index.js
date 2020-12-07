import init from 'startupjs/init/server'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
import getDocsRoutes from '@startupjs/docs/routes'

import { initAuth } from '@startupjs/auth/server'
import { Strategy as FacebookStrategy } from '@startupjs/auth-facebook/server'
import { Strategy as GoogleStrategy } from '@startupjs/auth-google/server'
import { Strategy as LinkedinStrategy } from '@startupjs/auth-linkedin/server'
import { Strategy as AzureADStrategy } from '@startupjs/auth-azuread/server'
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'

import conf from 'nconf'
import orm from '../model'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getMainRoutes(),
    ...getDocsRoutes(),
    ...getAuthRoutes()
  ]
}, (ee, options) => {
  initApp(ee, {
    ios: conf.get('CRITICAL_VERSION_IOS'),
    android: conf.get('CRITICAL_VERSION_ANDROID'),
    web: conf.get('CRITICAL_VERSION_WEB')
  })

  initAuth(ee, {
    successRedirectUrl: '/profile',
    strategies: [
      new LocalStrategy({
        // Vars
        // resetPasswordTimeLimit: 60 * 1000 * 10,
        // emailRegistrationRegexp: /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/,

        // Hooks
        // onCreatePasswordResetSecret: async ({userId, secret}, req) => {
        //   console.log('\nonCreatePasswordResetSecret', userId, secret)
        // },
        // onBeforeRegister: async (req, res, next) => {
        //   console.log(req.body)
        //   next()
        // },
        // onAfterRegister: async ({ userId }, req) => {
        //   console.log(userId)
        // }
        // onBeforePasswordChange: (req, res, next) => {
        //   console.log('\onBeforePasswordChange')
        //   next()
        // },
        // onAfterPasswordChange: userId => {
        //   console.log('\onAfterPasswordChange')
        // }
        //
      }),
      new FacebookStrategy({
        clientId: conf.get('FACEBOOK_CLIENT_ID'),
        clientSecret: conf.get('FACEBOOK_CLIENT_SECRET')
      }),
      new GoogleStrategy({
        clientId: conf.get('GOOGLE_CLIENT_ID'),
        clientSecret: conf.get('GOOGLE_CLIENT_SECRET')
      }),
      new LinkedinStrategy({
        clientId: conf.get('LINKEDIN_CLIENT_ID'),
        clientSecret: conf.get('LINKEDIN_CLIENT_SECRET')
      }),
      new AzureADStrategy({
        clientId: conf.get('AZUREAD_CLIENT_ID'),
        clientSecret: conf.get('AZUREAD_CLIENT_SECRET'),
        tentantId: conf.get('AZUREAD_TENTANT_ID'),
        identityMetadata: conf.get('AZUREAD_IDENTITY_METADATA'),
        allowHttpForRedirectUrl: process.env.NODE_ENV !== 'production'
      })
    ]
    // Global auth hooks
    // onBeforeLoginHook: async ({ userId }, req, res, next) => {
    //   console.log('onBeforeLoginHook', userId)
    //   next()
    // },
    // onBeforeLogoutHook: async (req, res, next) => {
    //   console.log('onBeforeLogoutHook', req.session.user)
    //   next()
    // },
    // parseUserCreationData: async user => {
    //   console.log('\nexample onUserCreate', user, '\n')
    //   return { ...user, additionalField: 777 }
    // }
    // onAfterUserCreationHook: async userId => {
    //   console.log('\nexample onAfterUserCreationHook', user, '\n')
    //   return { ...user, additionalField: 777 }
    // }
  })
})

function getHead (appName) {
  return `
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
