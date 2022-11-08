import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router'
import {
  $root,
  observer,
  emit,
  initLocalCollection
} from 'startupjs'
import omit from 'lodash/omit'
import qs from 'qs'
import RoutesWrapper from './RoutesWrapper'

export default observer(function Routes ({
  routes,
  ...props
}) {
  const routeComponents = routes.map(route => {
    const props = omit(route, ['component'])

    function render (props) {
      return route.redirect
        ? pug`
          Redirect(to=route.redirect)
        `
        : pug`
          //- DEPRECATED
          //- TODO: We can remove passing props because
          //- in pages we can use react-router hooks for this
          RouteComponent(
            key=props.match.url
            route=route
            ...props
          )
        `
    }

    return pug`
      Route(
        key=route.path
        render=render
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
  ...props
}) {
  // don't render anything while useEffect ends
  const [render, setRender] = useState(false)

  useEffect(() => {
    ;(async () => {
      initRoute(location, match.params)
      const filters = route.filters || []
      if (filters.length) await runFilters(route.filters)
      setRender(true)
    })()
  }, [location.pathname, location.search, location.hash])

  if (!render) return null

  const RC = route.component
  if (!RC) throw new Error('No route.component specified for route "' + route.path + '"')

  return pug`
    //- DEPRECATED
    //- TODO: We can remove passing match, location and props because
    //- in pages we can use react-router hooks for this
    //- Think about remove params=route.params
    RC(
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
  const prevHash = $root.get('$render.hash')
  const url = location.pathname
  const search = location.search
  const hash = location.hash
  const query = qs.parse(location.search, { ignoreQueryPrefix: true })
  if (url === prevUrl && search === prevSearch && hash === prevHash) return
  $root.setDiff('$render.prevUrl', prevUrl)
  $root.setDiff('$render.url', url)
  $root.setDiff('$render.hash', location.hash)
  $root.setDiff('$render.search', search)
  $root.setDiffDeep('$render.query', query)

  if (url !== prevUrl) {
    $root.setDiffDeep('$render.params', routeParams)
    $root.setDiff('_session.url', location.pathname) // TODO: DEPRECATED
    $root.silent().destroy('_page')
    initLocalCollection('_page')
  }
}

function runFilters (filters = []) {
  return new Promise(resolve => {
    filters = filters.slice()

    function runFilter (err) {
      if (err) return emit('error', err)
      const filter = filters.shift()
      if (typeof filter === 'function') {
        return filter($root, runFilter, (url) => {
          emit('url', url, { replace: true })
        })
      }
      resolve()
    }

    runFilter()
  })
}
