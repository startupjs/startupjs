import init from 'startupjs/init'
import startupjsServer from 'startupjs/server'
import { initApp } from 'startupjs/app/server'
import { initI18n, getI18nRoutes } from 'startupjs/i18n/server'
import { getAuthRoutes } from '@startupjs/auth/isomorphic'
import getDocsRoutes from '@startupjs/docs/routes'
import { getUiHead, initUi } from '@startupjs/ui/server'
import { initAuth } from '@startupjs/auth/server'
import { initTwoFAManager } from '@startupjs/2fa-manager/server'
import { TotpProvider } from '@startupjs/2fa-totp-authentication-provider'
import { PushProvider } from '@startupjs/2fa-push-notification-provider'
import { initRecaptcha, getRecaptchaHead } from '@startupjs/recaptcha/server'
import { initPushNotifications, initFirebaseApp } from '@startupjs/push-notifications/server'
import { getPushNotificationsRoutes } from '@startupjs/push-notifications/isomorphic'
import { Strategy as AppleStrategy } from '@startupjs/auth-apple/server'
import { Strategy as AzureADStrategy } from '@startupjs/auth-azuread/server'
import { Strategy as FacebookStrategy } from '@startupjs/auth-facebook/server'
import { Strategy as GoogleStrategy } from '@startupjs/auth-google/server'
import { Strategy as LinkedinStrategy } from '@startupjs/auth-linkedin/server'
import { Strategy as LocalStrategy } from '@startupjs/auth-local/server'
import { Strategy as CommonStrategy } from '@startupjs/auth-common/server'
import { Strategy as IDGStrategy } from '@startupjs/auth-idg/server'

import fs from 'fs'
import path from 'path'
import conf from 'nconf'
import initRecaptchaDoc from './initRecaptchaDoc'
import app from '../app.json'
import orm from '../model'
import getMainRoutes from '../main/routes'

// Init startupjs ORM.
init({ orm })

const serviceAccountPath = path.join(process.cwd(), 'server/serviceAccountKey.private.json')
const isServiceAccountExists = fs.existsSync(serviceAccountPath)
isServiceAccountExists && initFirebaseApp(serviceAccountPath)

// Check '@startupjs/server' readme for the full API
startupjsServer({
  getHead,
  appRoutes: [
    ...getAuthRoutes(),
    ...getI18nRoutes(),
    ...getDocsRoutes(),
    ...getMainRoutes(),
    ...getPushNotificationsRoutes()
  ],
  secure: false // turn on when we add plugins for access, schema in orm
}, (ee, options) => {
  initApp(ee, {
    ios: conf.get('CRITICAL_VERSION_IOS'),
    android: conf.get('CRITICAL_VERSION_ANDROID'),
    web: conf.get('CRITICAL_VERSION_WEB')
  })
  const rootPath = options.dirname.replace(/\/styleguide/g, '')
  initUi(ee, { dirname: rootPath })
  initI18n(ee)
  initRecaptcha(ee)
  initRecaptchaDoc(ee)
  initTwoFAManager(ee, {
    providers: [
      [TotpProvider, { appName: app.expo.name }],
      [PushProvider]
    ]
  })

  try {
    initPushNotifications(ee)
  } catch (err) {
    console.error(err.message)
    console.error('Push Notifications will not work!')
  }

  initAuth(ee, {
    onBeforeLoginHook: ({ userId }, req, res, next) => {
      // req.cookies.authRedirectUrl = '/custom-redirect-path'
      next()
    },
    strategies: getAuthStrategies(),
    recaptchaEnabled: true
  })
})

function getAuthStrategies () {
  const strategies = [
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
    new CommonStrategy({
      providerName: 'virgin',
      authorizationURL: 'http://localhost:4000/oauth/authorize',
      tokenURL: 'http://localhost:4000/oauth/token',
      profileURL: 'http://localhost:4000/oauth/get-me',
      callbackURL: conf.get('BASE_URL') + '/auth/virgin/callback',
      clientId: 'e710f1a6-e43f-4775-ab85-5ab496167bb4',
      clientSecret: '7e2031ac-f634-467b-8105-707ffb46e879'
    }),
    new LocalStrategy({
      getUserData: function () {
        return {
          email: this.getEmail(),
          firstName: this.getFirstName(),
          lastName: this.getLastName(),
          avatarUrl: this.getAvatarUrl(),
          age: this.profile.age
        }
      }
    }),
    new IDGStrategy({
      clientId: conf.get('IDG_CLIENT_ID'),
      clientSecret: conf.get('IDG_CLIENT_SECRET')
    })
  ]

  const isPrivateFilesExist =
    fs.existsSync(path.join(process.cwd(), 'server/appleAuthKey.private.p8')) &&
    fs.existsSync(path.join(process.cwd(), 'config.private.json'))

  if (isPrivateFilesExist) {
    strategies.concat([
      new AppleStrategy({
        clientId: conf.get('APPLE_CLIENT_ID'),
        teamId: conf.get('APPLE_TEAM_ID'),
        keyId: conf.get('APPLE_KEY_ID'),
        privateKeyLocation: path.join(process.cwd(), 'server/appleAuthKey.private.p8')
      }),
      new AzureADStrategy({
        clientId: conf.get('AZUREAD_CLIENT_ID'),
        clientSecret: conf.get('AZUREAD_CLIENT_SECRET'),
        tentantId: conf.get('AZUREAD_TENTANT_ID'),
        identityMetadata: conf.get('AZUREAD_IDENTITY_METADATA'),
        allowHttpForRedirectUrl: true
      })
    ])
  }

  return strategies
}

function getHead (appName, req) {
  return `
    ${getUiHead()}
    ${getRecaptchaHead(req)}
    <title>StartupJS UI</title>
    <!-- Put vendor JS and CSS here -->
  `
}

export default function run () {}
