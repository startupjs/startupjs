import React, { useMemo, Suspense } from 'react'
import { Platform } from 'react-native'
import { generatePath } from 'react-router-native'
import { useLocal, observer, useDoc, useModel, useSession, useApi, $root } from 'startupjs'
import _find from 'lodash/find'
import decodeUriComponent from 'decode-uri-component'
import axios from 'axios'
import { Blocked, UpdateApp } from './components'
import useMediaUpdate from './helpers/useMediaUpdate'
import Router from './Router'

const OS = Platform.OS
const routesGlobal = []

// Guarantee that we don't send duplicate init session requests to the server
let sessionInitialized = false

function useGlobalInitBase (cb) {
  useApi('_session.__initialized', initServerSession, [])

  const $session = useModel('_session')

  const [userId] = useSession('userId')
  const [, $user] = useDoc('users', userId || '_DUMMY_')

  useMemo(() => {
    // reference self to '_session.user' for easier access
    $session.ref('user', $user)
  }, [])

  return cb ? cb() : true
}

export function pathFor (name, options) {
  if (!name) throw Error('[pathFor]: No name specified')
  const route = _find(routesGlobal, { name })
  if (!route) throw Error('[pathFor]: There is no such a route: ' + name)
  let url = decodeUriComponent(generatePath(route.path, options))
  return url
}

const App = observer(function AppComponent ({
  apps,
  criticalVersion,
  useGlobalInit,
  androidUpdateLink,
  iosUpdateLink,
  supportEmail,
  ...props
}) {
  // Dynamically update @media queries in CSS whenever window width changes
  useMediaUpdate()

  const isGlobalInitSuccessful = useGlobalInitBase(useGlobalInit)

  if (useCheckCriticalVersion(criticalVersion)) {
    return pug`
      UpdateApp(
        androidUpdateLink=androidUpdateLink
        iosUpdateLink=iosUpdateLink
        supportEmail=supportEmail
      )
    `
  }

  const [user] = useLocal('_session.user')
  if (!isGlobalInitSuccessful) return null

  const roots = {}
  const routes = []

  // reset global routes variable
  routesGlobal.length = 0

  for (const appName in apps) {
    const appRoutes = apps[appName].routes
    roots[appName] = apps[appName].Layout
    for (const route of appRoutes) {
      route.app = appName
    }
    routesGlobal.push(...appRoutes)
    routes.push(...appRoutes)
  }

  return pug`
    if user && user.blocked
      Blocked
    else
      Suspense(fallback=null)
        Router(
          apps=roots
          routes=routes
          ...props
        )
  `
})

export default App

function useCheckCriticalVersion (currentVersion) {
  const [newVersion] = useSession('criticalVersion')
  const newOsVersion = newVersion && newVersion[OS]
  const currentOsVersion = currentVersion && currentVersion[OS]

  return (currentOsVersion && newOsVersion && currentOsVersion < newOsVersion)
}

async function initServerSession () {
  if (sessionInitialized) return true
  try {
    const res = await axios.get('/api/serverSession')
    sessionInitialized = true
    $root.setEach('_session', res.data)
  } catch {
    throw Error('[@startupjs/app] Error retrieving _session from server')
  }
  return true
}
