import React, { useState, useMemo } from 'react'
import RouterComponent from './RouterComponent'
import { withRouter, useHistory } from 'react-router-native'
import { matchRoutes } from 'react-router-config'
import { $root, observer, useSyncEffect, initLocalCollection } from 'startupjs'
import { Linking, Platform } from 'react-native'
import { matchPath } from 'react-router'
import Routes from './Routes'
import Error from './Error'
import qs from 'qs'
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
    initRoute(location, routes, goTo)

    const unlisten = history.listen((location) => {
      initRoute(location, routes, goTo)
    })

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

  function goTo (url, options) {
    typeof goToHandler === 'function'
      ? goToHandler(url, options, _goTo)
      : _goTo(url, options)
  }

  function _goTo (url, options = {}) {
    const app = getApp(url.replace(/\?.*$/, ''), routes)
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

function initRoute (location, routes, goTo) {
  // Check if url or search changed between page rerenderings
  const prevUrl = $root.get('$render.url')
  const prevSearch = $root.get('$render.search')
  const url = location.pathname
  const search = location.search
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  if (url === prevUrl && search === prevSearch) return
  if (!$root.get('$render')) initLocalCollection('$render')
  $root.setDiff('$render.url', url)
  $root.setDiff('$render.search', search)
  $root.setDiffDeep('$render.query', query)

  if (url !== prevUrl) {
    const matched = matchRoutes(routes, url)
    if (matched.length) {
      const lastRoute = matched[matched.length - 1]
      const redirectUrl = lastRoute.route.redirect

      if (redirectUrl) {
        goTo(redirectUrl, { replace: true })
        return
      }

      $root.setDiffDeep('$render.params', lastRoute.match.params)
    }
    $root.setDiff('_session.url', location.pathname) // TODO: DEPRECATED
    $root.silent().destroy('_page')
    initLocalCollection('_page')
  }
}
