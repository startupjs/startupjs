import React, { useState, useEffect } from 'react'

let App = null

export default function Root () {
  let [session, setSession] = useState()

  function onAuthorized (session) {
    // require application only after authentication completes because:
    // 1. we want the auth to load as fast as possible
    // 2. we don't want to initialize StartupJS connection to server
    //    until we have saved the session cookie. Otherwise the websocket
    //    connection will keep using the old cookies. React-native
    //    does not reestablish websocket connection when cookies change.
    App = require('./App').default
    // TODO: Pass userId from server _session
    setSession(session)
  }

  if (session) {
    return <App session={session} />
  } else {
    return <NativeAuth onAuthorized={onAuthorized} />
  }
}

function NativeAuth ({ onAuthorized }) {
  // Here is the place to handle any kind of native-only
  // authorization logic before letting the user into the App
  useEffect(() => {
    onAuthorized({ userId: 'dummy-native-user' })
  }, [])
  return null
}
