import React, { Suspense } from 'react'
import { Platform } from 'react-native'
import Router from './Router'
import { useLocal, observer, useDoc } from 'startupjs'
import { Blocked, UpdateApp } from './components'
import useMediaUpdate from './helpers/useMediaUpdate'
import _find from 'lodash/find'
import { generatePath } from 'react-router-native'
import decodeUriComponent from 'decode-uri-component'

const OS = Platform.OS
const routesGlobal = []

export function pathFor (name, options) {
  if (!name) throw Error('[pathFor]: No name specified')
  const route = _find(routesGlobal, { name })
  if (!route) throw Error('[pathFor]: There is no such a route: ' + name)
  let url = decodeUriComponent(generatePath(route.path, options))
  return url
}

const App = observer(function AppComponent ({
  apps,
  supportEmail,
  criticalVersion,
  iosUpdateLink,
  androidUpdateLink,
  ...props
}) {
  // Dynamically update @media queries in CSS whenever window width changes
  useMediaUpdate()

  const [version] = useDoc('service', 'version')
  const availableCriticalVersion =
    version &&
    version.criticalVersion &&
    version.criticalVersion[OS]
  const currentCriticalVersion =
    criticalVersion &&
    criticalVersion[OS]

  if (
    currentCriticalVersion && availableCriticalVersion &&
    currentCriticalVersion < availableCriticalVersion
  ) {
    return pug`
      UpdateApp(
        iosLink=iosUpdateLink
        androidLink=androidUpdateLink
      )
    `
  }
  const [user] = useLocal('_session.user')
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
      Blocked(email=supportEmail)
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
