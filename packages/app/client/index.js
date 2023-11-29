import React, { useMemo, Suspense } from 'react'
import { Platform } from 'react-native'
import { generatePath } from 'react-router-native'
import {
  pug,
  useLocal,
  observer,
  useDoc,
  useModel,
  useSession,
  useApi,
  $root
} from 'startupjs'
import { PluginsProvider } from '@startupjs/plugin'
import _find from 'lodash/find'
import decodeUriComponent from 'decode-uri-component'
import axios from 'axios'
import { Blocked, UpdateApp } from './components'
import { useMediaUpdate, useNeedUpdate } from './helpers'
import Router from './Router'
import packageJson from '../package.json'

const { name: packageName } = packageJson

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
    // set system info
    $root.setDiff('$system.platform', Platform.OS)
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
  plugins,
  criticalVersion,
  useGlobalInit,
  androidUpdateLink,
  iosUpdateLink,
  supportEmail,
  renderBlocked,
  ...props
}) {
  // Dynamically update @media queries in CSS whenever window width changes
  useMediaUpdate()

  const [user] = useLocal('_session.user')
  const isNeedUpdate = useNeedUpdate(criticalVersion)

  const isGlobalInitSuccessful = useGlobalInitBase(useGlobalInit)

  if (isNeedUpdate) {
    return pug`
      UpdateApp(
        androidUpdateLink=androidUpdateLink
        iosUpdateLink=iosUpdateLink
        supportEmail=supportEmail
      )
    `
  }

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
      if renderBlocked
        = renderBlocked(Blocked)
      else
        Blocked
    else
      Suspense(fallback=null)
        PluginsProvider(
          moduleName=packageName
          plugins=plugins
        )
          Router(
            apps=roots
            routes=routes
            supportEmail=supportEmail
            ...props
          )
  `
})

export default App

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
