import React, { useState, useMemo } from 'react'
import RouterComponent from './RouterComponent'
import { withRouter, useHistory } from 'react-router-native'
import { $root, observer, useSyncEffect, initLocalCollection } from 'startupjs'
import { Linking, Platform } from 'react-native'
import { matchPath } from 'react-router'
import Routes from './Routes'
import Error from './Error'
import qs from 'qs'
import isEqual from 'lodash/isEqual'
const isWeb = Platform.OS === 'web'

export default observer(function Router (props) {
  return pug`
    RouterComponent
      AppsFactoryWithRouter(...props)
  `
})

const AppsFactoryWithRouter = withRouter(observer(function AppsFactory ({
  location,
  apps,
  animate,
  routes,
  errorPages,
  goToHandler
}) {
  const history = useHistory()
  const [err, setErr] = useState()

  const app = useMemo(() => {
    return getApp(location.pathname, routes)
  }, [location.pathname])

  useSyncEffect(() => {
    initRoute(location)
    const unlisten = history.listen(initRoute)
    $root.on('url', goTo)

    return () => {
      unlisten()
      $root.removeListener('url', goTo)
    }
  }, [])

  useSyncEffect(() => {
    if (err) setErr()
  }, [location.pathname])

  const Layout = app ? apps[app] : null

  if (!Layout) {
    console.error('App not found')
    return null
  }

  function goTo (url) {
    typeof goToHandler === 'function'
      ? goToHandler(url, _goTo)
      : _goTo(url)
  }

  function _goTo (url) {
    const app = getApp(url.replace(/\?.*$/, ''), routes)

    if (app) {
      history.push(url)
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
      Layout
        Routes(
          animate=animate
          routes=routes
          onRouteError=setErr
        )
  `
}))

function getApp (url, routes) {
  const route = routes.find(route => matchPath(url, route))
  return route ? route.app : null
}

function initRoute (location) {
  // Check if url or search changed between page rerenderings
  const prevUrl = $root.get('$render.url')
  const prevQuery = $root.get('$render.query')
  const url = location.pathname
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })

  if (url === prevUrl && isEqual(query, prevQuery)) return
  if (!$root.get('$render')) initLocalCollection('$render')
  $root.setDiff('$render.url', url)
  $root.setDiffDeep('$render.query', query)
  if (url !== prevUrl) {
    $root.setDiff('_session.url', location.pathname) // TODO: DEPRECATED
    $root.silent().destroy('_page')
    initLocalCollection('_page')
  }
}
