import { BASE_URL } from '@env'
import init from 'startupjs/init'
import orm from '../model'
import React, { useMemo } from 'react'
import App from 'startupjs/app'
import { observer, useModel, useSession, useDoc } from 'startupjs'

// Frontend micro-services
import * as main from '../main'

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

// Global initialization logic
function useGlobalInit (session) {
  let $session = useModel('_session')

  // Initialize _session on mobile
  useMemo(() => session && $session.setEach(session), [])

  let [userId] = useSession('userId')
  let [user, $user] = useDoc('users', userId)

  // Create an anonymous user data if it doesn't exist.
  // You would want to remove this logic after adding real authorization.
  if (!user) {
    console.warn('Anonymous user detected. Creating DUMMY user data...')
    throw $user.create()
  }

  useMemo(() => {
    // reference self to '_session.user' for easier access
    $session.ref('user', $user)
  }, [])
}

export default observer(({ session }) => {
  useGlobalInit(session)

  return pug`
    App(apps={main})
  `
})
