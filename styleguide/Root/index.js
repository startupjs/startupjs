import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import App from 'startupjs/app'
import { pug, observer, model, $ } from 'startupjs'
import { registerPlugins } from 'startupjs/plugin'
import { UiProvider, Palette, Colors } from '@startupjs/ui'
import { initPushNotifications, notifications } from '@startupjs/push-notifications'
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
// FIXME: i18n library conflicts with docs library '_session.lang'
// import i18n, { useI18nGlobalInit } from '../i18n'
import * as main from '../main'
import emoticons from '../../packages/plugin/readme/emoticons'

// Override default styles
import UI_STYLE_OVERRIDES from './uiOverrides.styl'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

registerPlugins({
  pluginsPackageModuleExample: [
    [emoticons, { size: 20 }]
  ]
})

const palette = new Palette()
const { Color, generateColors } = palette

const THEMES = {
  dark: generateColors({
    [Colors['bg-main']]: Color('main', 9),
    [Colors['text-main']]: Color('main', 0),
    [Colors['border-main']]: Color('main', 7),
    [Colors.secondary]: Color('main', 0)
  })
}

export default observer(() => {
  const $theme = $.session.theme
  const themeMeta = THEMES[$theme.get()] || {}

  return pug`
    UiProvider(style=UI_STYLE_OVERRIDES ...themeMeta)
      App(
        apps={ auth, docs, main, notifications }
        criticalVersion={
          ios: CRITICAL_VERSION_IOS,
          android: CRITICAL_VERSION_ANDROID,
          web: CRITICAL_VERSION_WEB
        }
        supportEmail=SUPPORT_EMAIL
        androidUpdateLink=UPDATE_LINK_ANDROID
        iosUpdateLink=UPDATE_LINK_IOS
        useGlobalInit=() => {
          initPushNotifications()
          return true
        }
      )
  `
})
