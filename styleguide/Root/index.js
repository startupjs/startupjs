// HACK: In order for parse-prop-types to work properly, we have to use it
//       before using the PropTypes.
//       See: https://github.com/diegohaz/parse-prop-types/issues/4#issuecomment-403294065
import parsePropTypes from 'parse-prop-types' // eslint-disable-line
import React from 'react'
import { Platform, Image } from 'react-native'
import init from 'startupjs/init'
import App from 'startupjs/app'
import { observer, model, u } from 'startupjs'
import { initAuthApp } from '@startupjs/auth'
import { AuthButton as AppleAuthButton } from '@startupjs/auth-apple'
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as FacebookAuthButton } from '@startupjs/auth-facebook'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
import { createAuthButton } from '@startupjs/auth-common'
import * as localForms from '@startupjs/auth-local'
import {
  BASE_URL,
  SUPPORT_EMAIL,
  UPDATE_LINK_IOS,
  UPDATE_LINK_ANDROID,
  CRITICAL_VERSION_IOS,
  CRITICAL_VERSION_ANDROID,
  CRITICAL_VERSION_WEB
} from '@env'
import orm from '../model'

// Frontend micro-services
import * as main from '../main'
import docs from '../docs'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

export default observer(() => {
  const logo = pug`
    Image(
      resizeMode='contain'
      style={ width: u(5), height: u(5) },
      source={ uri: '/img/docs.png' }
    )
  `

  const auth = initAuthApp({
    logo,
    localForms,
    redirectUrl: '/profile?customParam=dummy',
    socialButtons: [
      AppleAuthButton,
      AzureadAuthButton,
      FacebookAuthButton,
      GoogleAuthButton,
      LinkedinAuthButton,
      createAuthButton({
        label: 'Virgin',
        providerName: 'virgin',
        style: { backgroundColor: '#e1090d' },
        imageUrl: '/img/virgin.png'
      })
    ]
  })

  return pug`
    App(
      apps={ main, docs, auth }
      criticalVersion={
        ios: CRITICAL_VERSION_IOS,
        android: CRITICAL_VERSION_ANDROID,
        web: CRITICAL_VERSION_WEB
      }
      supportEmail=SUPPORT_EMAIL
      androidUpdateLink=UPDATE_LINK_ANDROID
      iosUpdateLink=UPDATE_LINK_IOS
    )
  `
})

// HACK. Described above. Prevent tree shaking from removing the parsePropTypes import
;(() => parsePropTypes)()
