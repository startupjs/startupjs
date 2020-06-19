import React, { useState, useLayoutEffect } from 'react'
import {
  $root,
  observer,
  emit,
  initLocalCollection
} from 'startupjs'
import { Route } from 'react-router'
import RoutesWrapper from './RoutesWrapper'
import omit from 'lodash/omit'
import qs from 'qs'

export default observer(function Routes ({
  routes,
  onRouteError,
  ...props
}) {
  function render (route, props) {
    if (route.redirect) {
      emit('url', route.redirect, { replace: true })
      return null
    }
    return pug`
      //- TODO: We can remove passing props because
      //- in pages we can use react-router hooks for this
      RouteComponent(...props route=route onError=onRouteError)
    `
  }

  const routeComponents = routes.map(route => {
    const props = omit(route, ['component'])
    return pug`
      Route(
        key=route.path
        render=render.bind(null, route)
        ...props
      )
    `
  })

  return pug`
    RoutesWrapper(...props)= routeComponents
  `
})

const RouteComponent = observer(function RCComponent ({
  route,
  location,
  match,
  onError,
  ...props
}) {
  const [render, setRender] = useState()

  function runFilters (filters) {
    if (!filters) return setRender(true)
    filters = filters.slice()
    function runFilter (err) {
      if (err) return onError(err)
      const filter = filters.shift()
      if (typeof filter === 'function') {
        return filter($root, runFilter, (url) => {
          emit('url', url)
        })
      }
      setRender(true)
    }
    runFilter()
  }

  useLayoutEffect(() => {
    initRoute(location, match.params)
    runFilters(route.filters)
  }, [location.pathname, location.search])

  if (!render) return null

  // Don't render anything if the route is just a redirect
  if (route.redirect) return null

  const RC = route.component
  if (!RC) throw new Error('No route.component specified for route "' + route.path + '"')

  return pug`
    RC(
      key=match.url
      params=route.params
      match=match
      location=location
      ...props
    )
  `
})

function initRoute (location, routeParams) {
  // Check if url or search changed between page rerenderings
  const prevUrl = $root.get('$render.url')
  const prevSearch = $root.get('$render.search')
  const url = location.pathname
  const search = location.search
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  if (url === prevUrl && search === prevSearch) return
  $root.setDiff('$render.url', url)
  $root.setDiff('$render.search', search)
  $root.setDiffDeep('$render.query', query)

  if (url !== prevUrl) {
    $root.setDiffDeep('$render.params', routeParams)
    $root.setDiff('_session.url', location.pathname) // TODO: DEPRECATED
    $root.silent().destroy('_page')
    initLocalCollection('_page')
  }
}
