import React, { useState, useMemo } from 'react'
import { Linking, Platform } from 'react-native'
import RNRestart from 'react-native-restart'
import { useLocation, useHistory } from 'react-router-native'
import { matchPath } from 'react-router'
import { $root, observer, useSyncEffect } from 'startupjs'
import { Slot } from '@startupjs/plugin'
import { BASE_URL } from '@env'
import axios from 'axios'
import RouterComponent from './RouterComponent'
import Routes from './Routes'
import Error from './Error'

const isWeb = Platform.OS === 'web'

export default observer(function Router (props) {
  return pug`
    RouterComponent
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

  const [err, setErr] = useState()
  const app = useMemo(() => {
    return getApp(location.pathname, routes)
  }, [location.pathname])

  useSyncEffect(() => {
    $root.on('url', goTo)
    $root.on('error', setErr)
    $root.on('restart', restart)

    return () => {
      $root.removeListener('url', goTo)
      $root.removeListener('error', setErr)
    }
  }, [])

  useSyncEffect(() => {
    if (err) setErr()
  }, [location.pathname])

  function goTo (url, options) {
    typeof goToHandler === 'function'
      ? goToHandler(url, options, _goTo)
      : _goTo(url, options)
  }

  function _goTo (url, options = {}) {
    const app = getApp(url.replace(/[?#].*$/, ''), routes)
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
    if err
      Error(error=err pages=errorPages supportEmail=supportEmail)
    else
      RenderApp(app=app routes=routes ...props)

  `
})

const RenderApp = observer(function RenderAppComponent ({
  apps,
  app,
  ...props
}) {
  const Layout = app ? apps[app] : null

  if (!Layout) {
    console.error(`[@startupjs/app] Layout not found in '${app}' app`)
    return null
  }

  return pug`
    Slot(name='LayoutWrapper')
      Layout
        Routes(...props)
  `
})

function getApp (url, routes) {
  const route = routes.find(route => matchPath(url, route))
  return route ? route.app : null
}
