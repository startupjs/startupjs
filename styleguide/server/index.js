import init from 'startupjs/init/server'
import orm from '../model'
import startupjsServer from 'startupjs/server'
import getMainRoutes from '../main/routes'
import getDocsRoutes from '@startupjs/docs/routes'
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
import { initApp } from 'startupjs/app/server'

import { initAuth } from '@startupjs/auth/server'
import { Strategy as FacebookStrategy } from '@startupjs/auth-facebook/server'
import { Strategy as GoogleStrategy } from '@startupjs/auth-google/server'
import { Strategy as LinkedinStrategy } from '@startupjs/auth-linkedin/server'
import { Strategy as AzureADStrategy } from '@startupjs/auth-azuread/server'
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'

import conf from 'nconf'

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
  initApp(ee)

  initAuth(ee, {
    successRedirectUrl: '/profile',
    strategies: [
      new LocalStrategy({}),
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
  })
})

function getHead (appName) {
  return `
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
