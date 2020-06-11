import env from '@env'
import init from 'startupjs/init'
import orm from '../model'
import React from 'react'
import { observer, model } from 'startupjs'
import { Platform } from 'react-native'
import { TestComponent } from 'components'

const { BASE_URL } = env

if (Platform.OS === 'web') window.model = model

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

export default observer(() => {
  return pug`
    TestComponent
  `
})
