import React, { useState, useMemo } from 'react'
import RouterComponent from './RouterComponent'
import { useLocation, useHistory } from 'react-router-native'
import { $root, observer, useSyncEffect } from 'startupjs'
import { Linking, Platform } from 'react-native'
import { matchPath } from 'react-router'
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

  return pug`
    if err
      Error(value=err pages=errorPages)
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
    Layout
      Routes(...props)
  `
})

function getApp (url, routes) {
  const route = routes.find(route => matchPath(url, route))
  return route ? route.app : null
}
