import React, { useState } from 'react'
import { Linking, Platform } from 'react-native'
import RNRestart from 'react-native-restart'
import { useLocation, useHistory } from 'react-router-native'
import { matchPath } from 'react-router'
import { pug, emit, $root, observer, useSyncEffect } from 'startupjs'
import { Slot } from '@startupjs/plugin'
import { BASE_URL } from '@env'
import axios from 'axios'
import RestoreUrl from './RestoreUrl'
import RouterComponent from './RouterComponent'
import Routes from './Routes'
import Error from './Error'

const isWeb = Platform.OS === 'web'

export default observer(function Router (props) {
  return pug`
    RouterComponent
      RestoreUrl
        AppsFactory(...props)
  `
})

const AppsFactory = observer(function AppsFactoryComponent ({
  routes,
  errorPages,
  goToHandler,
  supportEmail,
  ...props
}) {
  const location = useLocation()
  const history = useHistory()
  let [error, setError] = useState()
  const route = getRouteMeta(location.pathname, routes)
  let app

  console.log(route, 'route')

  route
    ? app = route.app
    : error = { code: 404 }

  useSyncEffect(() => {
    $root.on('url', goTo)
    $root.on('error', handleError)
    $root.on('restart', restart)

    return () => {
      $root.removeListener('url', goTo)
      $root.removeListener('error', handleError)
    }
  }, [])

  useSyncEffect(() => {
    if (error) setError()
  }, [location.pathname])

  function handleError (err) {
    if (err?.code === 'ERR_DOC_ALREADY_CREATED') return
    setError(isNaN(err) ? err : { code: err })
  }

  function goTo (url, options) {
    typeof goToHandler === 'function'
      ? goToHandler(url, options, _goTo)
      : _goTo(url, options)
  }

  function _goTo (url, options = {}) {
    const route = getRouteMeta(url.replace(/[?#].*$/, ''), routes)

    if (!route) return emit('error', 404)

    const app = route.app
    const { replace } = options

    if (app) {
      history[replace ? 'replace' : 'push'](url)
    } else {
      isWeb
        ? window.open(url, '_blank')
        : Linking.openURL(url)
    }
  }

  async function restart (restoreUrl) {
    if (restoreUrl) {
      await axios.post(BASE_URL + '/api/restore-url', { restoreUrl })
    }

    if (isWeb) {
      window.location.reload(true)
    } else {
      RNRestart.Restart()
    }
  }

  return pug`
    if error
      Error(error=error pages=errorPages supportEmail=supportEmail)
    else
      RenderApp(app=app routes=routes ...props)

  `
})

const RenderApp = observer(function RenderAppComponent ({
  apps,
  app,
  ...props
}) {
  // TODO
  // We should change the app in the route after run filters
  // because we see a new rendered layout for a moment if filter blocks route
  const Layout = app ? apps[app] : null

  if (!Layout) {
    console.error(`[@startupjs/app] Layout not found in '${app}' app`)
    return null
  }

  return pug`
    Slot(name='LayoutWrapper' type='nested')
      Layout
        Routes(...props)
  `
})

function getRouteMeta (url, routes) {
  return routes.find(route => matchPath(url, route))
}
