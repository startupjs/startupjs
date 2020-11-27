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
        // TODO:
        // validateRegisterHook: () => {},
        // validateLoginHook: () => {},
        // onBeforeRegisterHook: () => {},
        // onAfterRegisterHook: () => {},
        // email validation ?

        // TODO: refactor params
        // onCreatePasswordResetSecret: ({ userId, secret }, req, res, next) => {
        //   console.log('\nonCreatePasswordResetSecret', userId, secret)
        // },
        // onPasswordReset: ({ userId }, req, res, next) => {
        //   console.log('\nonPasswordReset', userId)
        // },
        // onPasswordChange: ({ userId }, req, res, next) => {
        //   console.log('\nPasswordChange', userId)
        // }
        onCreatePasswordResetSecret: (userId, secret) => {
          console.log('\nonCreatePasswordResetSecret', userId, secret)
        },
        onPasswordReset: userId => {
          console.log('\nonPasswordReset', userId)
        },
        onPasswordChange: userId => {
          console.log('\nPasswordChange', userId)
        }
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
    // TODO: describe behaviour of each hook
    // onBeforeLogintHook: async (data, req, res, next) => {
    //   console.log('onBeforeLogintHook', data)
    //   next()
    // },
    // onBeforeLogoutHook: async (data, req, res, next) => {
    //   console.log('onBeforeLogoutHook', data)
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
