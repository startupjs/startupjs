// HACK: In order for parse-prop-types to work properly, we have to use it
//       before using the PropTypes.
//       See: https://github.com/diegohaz/parse-prop-types/issues/4#issuecomment-403294065
import parsePropTypes from 'parse-prop-types' // eslint-disable-line
import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import App from 'startupjs/app'
import { observer, model } from 'startupjs'
import { registerPlugins } from '@startupjs/plugin'
import { uiAppPlugin } from '@startupjs/ui'
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
import auth from '../auth'
import docs from '../docs'
import i18n, { useI18nGlobalInit } from '../i18n'
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

registerPlugins({
  '@startupjs/app': [
    [uiAppPlugin, { defaultEnable: true }]
  ]
})

export default observer(() => {
  return pug`
    App(
      apps={ auth, docs, i18n, main }
      criticalVersion={
        ios: CRITICAL_VERSION_IOS,
        android: CRITICAL_VERSION_ANDROID,
        web: CRITICAL_VERSION_WEB
      }
      useGlobalInit=useI18nGlobalInit
      supportEmail=SUPPORT_EMAIL
      androidUpdateLink=UPDATE_LINK_ANDROID
      iosUpdateLink=UPDATE_LINK_IOS
    )
  `
})

// HACK. Described above. Prevent tree shaking from removing the parsePropTypes import
;(() => parsePropTypes)()
