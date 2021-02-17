import React from 'react'
import { Platform } from 'react-native'
import init from 'startupjs/init'
import { observer, model } from 'startupjs'
import { App, initPortal } from '@startupjs/ui'
import { BASE_URL } from '@env'
import orm from '../model'

// Frontend micro-services
import * as main from '../main'

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

export default observer(() => {
  return pug`
    App(
      apps={main}
      plugins=[initPortal]
    )
  `
})
