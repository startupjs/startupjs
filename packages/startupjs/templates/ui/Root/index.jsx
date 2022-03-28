import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import baseUrl from 'startupjs/baseUrl'
import { pug, observer, model } from 'startupjs'
import App from 'startupjs/app'
import { registerPlugins } from 'startupjs/plugin'
import { uiAppPlugin } from '@startupjs/ui'
import i18n, { useI18nGlobalInit } from '../i18n'
import orm from '../model'

// Frontend micro-services
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl, orm })

registerPlugins({
  '@startupjs/app': [
    [uiAppPlugin, { defaultEnable: true }]
  ]
})

export default observer(() => {
  return pug`
    App(
      apps={ i18n, main }
      useGlobalInit=useI18nGlobalInit
    )
  `
})
