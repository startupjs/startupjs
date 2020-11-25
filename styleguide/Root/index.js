// HACK: In order for parse-prop-types to work properly, we have to use it
//       before using the PropTypes.
//       See: https://github.com/diegohaz/parse-prop-types/issues/4#issuecomment-403294065
import parsePropTypes from 'parse-prop-types'
import { BASE_URL } from '@env'
import init from 'startupjs/init'
import orm from '../model'
import React from 'react'
import App from 'startupjs/app'
import { Platform } from 'react-native'
import { observer, model } from 'startupjs'
import { initAuthApp } from '@startupjs/auth'
import { AuthButton as FacebookAuthButton } from '@startupjs/auth-facebook'
import { AuthButton as GoogleAuthButton } from '@startupjs/auth-google'
import { AuthButton as AzureadAuthButton } from '@startupjs/auth-azuread'
import { AuthButton as LinkedinAuthButton } from '@startupjs/auth-linkedin/client'
import * as localForms from '@startupjs/auth-local'

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
  const auth = initAuthApp({
    localForms,
    socialButtons: [
      FacebookAuthButton,
      GoogleAuthButton,
      AzureadAuthButton,
      LinkedinAuthButton
    ]
  })

  return pug`
    App(apps={ main, docs, auth })
  `
})

// HACK. Described above. Prevent tree shaking from removing the parsePropTypes import
;(() => parsePropTypes)()
