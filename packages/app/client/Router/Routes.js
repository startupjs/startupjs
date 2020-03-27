import React, { useState, useEffect } from 'react'
import { $root, emit, initLocalCollection } from 'startupjs'
import { Route } from 'react-router'
import { Dimensions, Platform, View } from 'react-native'
import RoutesWrapper from './RoutesWrapper'
import qs from 'qs'
import omit from 'lodash/omit'
const isWeb = Platform.OS === 'web'

function getOrientation () {
  const dim = Dimensions.get('screen')
  return dim.width >= dim.height ? 'landscape' : 'portrait'
}

export default class Routes extends React.Component {
  componentDidMount () {
    $root.on('updateRoutes', this.update)
  }

  componentWillUnmount () {
    $root.removeListener('updateRoutes', this.update)
  }

  update = () => {
    this.forceUpdate()
  }

  render () {
    const { routes, onRouteError } = this.props
    const routeComponents = routes.map(route => {
      return (
        <Route
          key={route.path}
          {...omit(route, ['component'])}
          render={(props) => {
            initRoute(props)
            return pug`
              RouteComponent(...props route=route onError=onRouteError)
            `
          }}
        />
      )
    })

    return pug`
      RoutesWrapper(...this.props)= routeComponents
    `
  }
}

function initRoute ({ location, match }) {
  // Check if url or search changed between page rerenderings
  const prevUrl = $root.get('$render.url')
  const prevSearch = $root.get('$render.search')
  const url = location.pathname
  const search = location.search

  if (url === prevUrl && search === prevSearch) return
  if (!$root.get('$render')) initLocalCollection('$render')
  $root.setDiffDeep('$render.location', location)
  $root.setDiffDeep('$render.match', match)
  $root.setDiff('$render.url', url)
  $root.setDiff('$render.search', search)
  $root.setDiffDeep(
    '$render.query',
    qs.parse(search, { ignoreQueryPrefix: true })
  )
  if (url !== prevUrl) {
    $root.setDiff('_session.url', location.pathname) // TODO: DEPRECATED
    $root.silent().destroy('_page')
    initLocalCollection('_page')
  }
}

function RouteComponent ({ route, onError, ...props }) {
  const [render, setRender] = useState()
  const [orientation, setOrientation] = useState(getOrientation())
  useEffect(() => {
    // For android/iOS do force rerender when the screen orientation change
    if (isWeb) return
    Dimensions.addEventListener('change', orientationChangeHandler)
    return () => {
      Dimensions.removeEventListener('change', orientationChangeHandler)
    }
  }, [])

  function orientationChangeHandler () {
    const newOrientation = getOrientation()
    if (orientation !== newOrientation) setOrientation(newOrientation)
  }

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

  if (render) {
    const RC = route.component
    return pug`
      View(key=orientation style={flex: 1})
        RC(
          ...props
          key=props.match.url
          params=route.params
        )
    `
  } else {
    runFilters(route.filters)
    return null
  }
}
